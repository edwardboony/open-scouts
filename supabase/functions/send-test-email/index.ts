// Test email edge function - sends a test email to verify configuration

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase configuration missing");
    }

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "RESEND_API_KEY not configured in Supabase secrets. Please run: npx supabase secrets set RESEND_API_KEY=your_key"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch user's notification email from user_preferences
    const { data: preferences, error: prefError } = await supabase
      .from("user_preferences")
      .select("notification_email")
      .eq("id", "00000000-0000-0000-0000-000000000001")
      .single();

    if (prefError) {
      throw new Error(`Error fetching user preferences: ${prefError.message}`);
    }

    // Check if user has set an email
    if (!preferences?.notification_email) {
      return new Response(
        JSON.stringify({
          error: "No notification email set in settings. Please add your email in Settings first."
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const userEmail = preferences.notification_email;
    console.log(`Sending test email to: ${userEmail}`);

    // Create test email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9f9f9;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">

          <!-- Header -->
          <tr>
            <td style="background-color: #FF4C00; padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                🔍 Test Email
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; color: #262626; font-size: 16px; line-height: 1.5;">
                Great news! Your email notifications are configured correctly.
              </p>

              <div style="background-color: #f9f9f9; border-left: 4px solid #FF4C00; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                  What this means
                </p>
                <p style="margin: 0; color: #262626; font-size: 14px; line-height: 1.6;">
                  When your scouts find results, you'll receive beautiful email alerts just like this one with all the details of what they discovered.
                </p>
              </div>

              <div style="margin: 30px 0; color: #262626; font-size: 15px; line-height: 1.6;">
                <h2 style="color: #262626; font-size: 20px; margin: 20px 0 10px 0;">How it works</h2>
                <br>• Your scouts run automatically based on their frequency settings
                <br>• When a scout finds something interesting, the AI agent analyzes it
                <br>• If results are found, you'll get an instant email notification
                <br>• All results are also available in your Open Scouts dashboard
              </div>

              <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e5e5;">
                <a href="https://openscout.dev" style="display: inline-block; background-color: #FF4C00; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; font-size: 14px;">
                  Go to Open Scout
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0 0 10px 0; color: #999; font-size: 13px;">
                This is a test email sent from Open Scouts.
              </p>
              <p style="margin: 0; color: #999; font-size: 13px;">
                <a href="https://openscout.dev/settings" style="color: #FF4C00; text-decoration: none;">Manage notification settings</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    const emailPayload = {
      from: "Open Scouts <onboarding@resend.dev>",
      to: userEmail,
      subject: "Test Email - Open Scouts Notifications",
      html: emailHtml,
    };

    // Send email via Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to send email: ${response.status} - ${errorText}`);

      // Parse Resend error for better user-facing message
      let userFriendlyError = "Failed to send email. Please try again.";
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.message) {
          // Check for common Resend errors and provide friendly messages
          if (errorJson.statusCode === 403 && errorJson.message.includes("only send testing emails to your own email")) {
            // Extract the allowed email from the error message
            const emailMatch = errorJson.message.match(/\(([^)]+)\)/);
            const allowedEmail = emailMatch ? emailMatch[1] : "your Resend account email";
            userFriendlyError = `For testing without a verified domain, Resend only allows sending to ${allowedEmail}. Either use that email in Settings, or verify a custom domain at resend.com/domains.`;
          } else {
            userFriendlyError = errorJson.message;
          }
        }
      } catch {
        userFriendlyError = errorText;
      }

      return new Response(
        JSON.stringify({
          error: userFriendlyError,
          status: response.status
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    const result = await response.json();
    console.log(`Test email sent successfully! ID: ${result.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Test email sent to ${userEmail}`,
        emailId: result.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error in send-test-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
