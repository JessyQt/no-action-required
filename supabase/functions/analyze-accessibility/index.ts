import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import axe from "https://esm.sh/axe-core@4.7.0";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { url, scanId } = await req.json();
    console.log("Analyzing URL:", url);

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch the webpage
    const response = await fetch(url);
    const html = await response.text();

    // Parse the HTML
    const parser = new DOMParser();
    const document = parser.parseFromString(html, "text/html");

    if (!document) {
      throw new Error("Failed to parse HTML");
    }

    // Configure axe for server-side environment
    const config = {
      rules: [
        { id: "color-contrast", enabled: true },
        { id: "image-alt", enabled: true },
        { id: "label", enabled: true },
        { id: "link-name", enabled: true },
      ],
      checks: [
        { id: "color-contrast", options: { noScroll: true } },
      ],
      resultTypes: ["violations"],
    };

    // Run accessibility analysis
    const results = await axe.run(document.documentElement, config);
    console.log("Analysis results:", results);

    // Calculate score based on violations
    const maxScore = 100;
    const deductPerViolation = 5;
    const score = Math.max(
      0,
      maxScore - results.violations.length * deductPerViolation
    );

    // Update scan with score
    await supabaseClient
      .from("accessibility_scans")
      .update({ 
        score,
        completed_at: new Date().toISOString()
      })
      .eq("id", scanId);

    // Insert issues
    const issues = results.violations.map((violation) => ({
      scan_id: scanId,
      severity: violation.impact || "error",
      message: violation.help,
      impact: violation.description,
      recommendation: violation.helpUrl,
      wcag_criterion: violation.tags.find((tag) => tag.startsWith("wcag"))?.toUpperCase() || null,
      html_element: violation.nodes[0]?.html || null,
    }));

    if (issues.length > 0) {
      await supabaseClient.from("accessibility_issues").insert(issues);
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in analyze-accessibility:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});