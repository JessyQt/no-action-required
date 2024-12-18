import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import axe from "https://esm.sh/axe-core@4.7.0";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

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

    const response = await fetch(url);
    const html = await response.text();

    const parser = new DOMParser();
    const document = parser.parseFromString(html, "text/html");

    if (!document) {
      throw new Error("Failed to parse HTML");
    }

    // Configure axe for server environment
    const config = {
      rules: [
        { id: "color-contrast", enabled: false }, // Disable color contrast check as it requires browser APIs
        { id: "image-alt", enabled: true },
        { id: "label", enabled: true },
        { id: "link-name", enabled: true },
      ],
      resultTypes: ["violations"],
      elementRef: false,
      noHtml: true, // Prevent axe from trying to access HTML elements directly
      runOnly: {
        type: "rule",
        values: ["image-alt", "label", "link-name"]
      }
    };

    console.log("Running axe analysis...");
    const results = await axe.run(document.documentElement, config);
    console.log("Analysis complete. Violations found:", results.violations.length);

    const maxScore = 100;
    const deductPerViolation = 5;
    const score = Math.max(
      0,
      maxScore - results.violations.length * deductPerViolation
    );

    await supabaseClient
      .from("accessibility_scans")
      .update({ 
        score,
        completed_at: new Date().toISOString()
      })
      .eq("id", scanId);

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

      await supabaseClient.from("accessibility_issues").insert(issues);
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