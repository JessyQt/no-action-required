import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "*",
  "Content-Type": "application/json",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  try {
    const { url, scanId } = await req.json();
    console.log("Analyzing URL:", url);

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const browser = await puppeteer.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu"
      ],
      headless: true,
    });

    try {
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      console.log("Navigating to URL:", url);
      await page.goto(url, { 
        waitUntil: "networkidle0",
        timeout: 30000 
      });

      // Inject axe-core
      await page.addScriptTag({ 
        url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.7.0/axe.min.js'
      });

      // Run accessibility analysis
      const results = await page.evaluate(() => {
        return window.axe.run(document, {
          runOnly: {
            type: "tag",
            values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]
          }
        });
      });

      console.log("Analysis complete. Violations found:", results.violations.length);

      const maxScore = 100;
      const deductPerViolation = 5;
      const score = Math.max(
        0,
        maxScore - results.violations.length * deductPerViolation
      );

      // Update scan record
      await supabaseClient
        .from("accessibility_scans")
        .update({ 
          score,
          completed_at: new Date().toISOString()
        })
        .eq("id", scanId);

      // Save violations
      if (results.violations.length > 0) {
        const issues = results.violations.map((violation) => ({
          scan_id: scanId,
          severity: violation.impact || "error",
          message: violation.help,
          impact: violation.description,
          recommendation: violation.helpUrl,
          wcag_criterion: violation.tags.find((tag) => tag.startsWith("wcag"))?.toUpperCase() || null,
          html_element: violation.nodes[0]?.html || null,
        }));

        await supabaseClient
          .from("accessibility_issues")
          .insert(issues);
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          score, 
          violations: results.violations.length 
        }),
        { 
          status: 200,
          headers: corsHeaders 
        }
      );

    } finally {
      await browser.close();
    }

  } catch (error) {
    console.error("Error in analyze-accessibility:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      { 
        status: 500,
        headers: corsHeaders 
      }
    );
  }
});