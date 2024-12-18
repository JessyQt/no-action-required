import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { 
      status: 200,
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

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
      await page.goto(url, { waitUntil: "networkidle2" });

      // Inject axe-core into the page
      await page.addScriptTag({ path: "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.7.0/axe.min.js" });

      // Run accessibility analysis using axe-core
      const results = await page.evaluate(() => {
        return window.axe.run();
      });

      console.log("Analysis complete. Violations found:", results.violations.length);

      const maxScore = 100;
      const deductPerViolation = 5;
      const score = Math.max(
        0,
        maxScore - results.violations.length * deductPerViolation
      );

      // Update the scan record in Supabase
      try {
        await supabaseClient
          .from("accessibility_scans")
          .update({ 
            score,
            completed_at: new Date().toISOString()
          })
          .eq("id", scanId);
      } catch (dbError) {
        console.error("Error updating scan record in Supabase:", dbError);
      }

      // Save violations in Supabase
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

        try {
          await supabaseClient.from("accessibility_issues").insert(issues);
        } catch (dbError) {
          console.error("Error inserting issues in Supabase:", dbError);
        }
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
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: corsHeaders 
      }
    );
  }
});
