"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Button from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn-default/input";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { Check, AlertCircle, Mail, Bell } from "lucide-react";
import { Connector } from "@/components/shared/layout/curvy-rect";

const PREFERENCES_ID = "00000000-0000-0000-0000-000000000001";

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [sendingTest, setSendingTest] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [testMessage, setTestMessage] = useState("");

  // Load current preferences
  useEffect(() => {
    const loadPreferences = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from("user_preferences")
          .select("*")
          .eq("id", PREFERENCES_ID)
          .maybeSingle();

        if (data) {
          setEmail(data.notification_email || "");
        }
      } catch {
        // Silently handle any exceptions - preferences just won't be loaded
        // This is expected if the table doesn't exist yet or has RLS policies
      }
      setLoading(false);
    };

    loadPreferences();
  }, []);

  const savePreferences = async () => {
    setSaving(true);
    setSaveStatus("idle");

    // Validate email if provided
    if (email && !isValidEmail(email)) {
      setSaveStatus("error");
      setSaving(false);
      return;
    }

    try {
      const { error } = await supabase.from("user_preferences").upsert({
        id: PREFERENCES_ID,
        notification_email: email || null,
      });

      if (error) {
        setSaveStatus("error");
      } else {
        setSaveStatus("success");
        // Reset success message after 3 seconds
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    } catch {
      setSaveStatus("error");
    }

    setSaving(false);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendTestEmail = async () => {
    setSendingTest(true);
    setTestStatus("idle");
    setTestMessage("");

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const response = await fetch(
        `${supabaseUrl}/functions/v1/send-test-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setTestStatus("error");
        setTestMessage(data.error || "Failed to send test email");
      } else {
        setTestStatus("success");
        setTestMessage("Test email sent! Check your inbox.");
        // Reset success message after 5 seconds
        setTimeout(() => {
          setTestStatus("idle");
          setTestMessage("");
        }, 5000);
      }
    } catch (error) {
      setTestStatus("error");
      setTestMessage(
        error instanceof Error ? error.message : "Failed to send test email",
      );
    }

    setSendingTest(false);
  };

  return (
    <div className="min-h-screen bg-background-base">
      {/* Top border line */}
      <div className="h-1 w-full bg-border-faint" />

      <div className="container relative">
        {/* Corner connectors */}
        <Connector className="absolute -top-10 -left-[10.5px]" />
        <Connector className="absolute -top-10 -right-[10.5px]" />

        {/* Header Section */}
        <div className="py-48 lg:py-64 relative">
          {/* Bottom border */}
          <div className="h-1 bottom-0 absolute w-screen left-[calc(50%-50vw)] bg-border-faint" />
          <Connector className="absolute -bottom-10 -left-[10.5px]" />
          <Connector className="absolute -bottom-10 -right-[10.5px]" />

          <div className="px-24">
            <h1 className="text-title-h3 lg:text-title-h2 font-semibold text-accent-black">
              Settings
            </h1>
            <p className="text-body-large text-black-alpha-56 mt-4">
              Configure your notification preferences
            </p>
          </div>
        </div>

        {/* Section label */}
        <div className="py-24 lg:py-32 relative">
          <div className="h-1 bottom-0 absolute w-screen left-[calc(50%-50vw)] bg-border-faint" />

          <div className="flex items-center gap-16">
            <div className="w-2 h-16 bg-heat-100" />
            <div className="flex gap-12 items-center text-mono-x-small text-black-alpha-32 font-mono">
              <Bell className="w-14 h-14" />
              <span className="uppercase tracking-wider">Notifications</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pb-64">
          {loading ? (
            <div className="bg-white rounded-12 border border-border-faint p-24 max-w-600">
              <div className="space-y-24">
                <div>
                  <Skeleton className="h-16 w-128 mb-12" />
                  <Skeleton className="h-44 w-full rounded-8" />
                  <Skeleton className="h-14 w-256 mt-8" />
                </div>
                <Skeleton className="h-40 w-120 rounded-8" />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-12 border border-border-faint overflow-hidden max-w-600">
              <div className="p-24 space-y-24">
                {/* Email Notification Section */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-label-medium font-semibold text-accent-black mb-8"
                  >
                    Notification Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                    disabled={saving}
                  />
                  <p className="text-body-small text-black-alpha-48 mt-8">
                    Receive email notifications when your scouts find new
                    results
                  </p>

                  {/* Test Email Button */}
                  {email && isValidEmail(email) && (
                    <div className="mt-16">
                      <Button
                        onClick={sendTestEmail}
                        disabled={sendingTest}
                        variant="secondary"
                        className="flex items-center gap-8"
                      >
                        {sendingTest ? (
                          <>
                            <div className="animate-spin rounded-full h-16 w-16 border-2 border-black-alpha-32 border-t-transparent" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Mail className="w-16 h-16" />
                            Send Test Email
                          </>
                        )}
                      </Button>

                      {testMessage && (
                        <div
                          className={`flex items-start gap-8 mt-12 p-12 rounded-8 ${
                            testStatus === "success"
                              ? "bg-green-500/10 text-green-700 border border-green-500/20"
                              : "bg-heat-100/10 text-heat-100 border border-heat-100/20"
                          }`}
                        >
                          {testStatus === "success" ? (
                            <Check className="w-16 h-16 mt-2 shrink-0" />
                          ) : (
                            <AlertCircle className="w-16 h-16 mt-2 shrink-0" />
                          )}
                          <span className="text-body-small leading-relaxed">
                            {testMessage}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Save Button */}
                <div className="flex items-center gap-12">
                  <Button
                    onClick={savePreferences}
                    disabled={saving}
                    className="flex items-center gap-8"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-16 w-16 border-2 border-white border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      "Save Preferences"
                    )}
                  </Button>

                  {saveStatus === "success" && (
                    <div className="flex items-center gap-8 text-green-600">
                      <Check className="w-16 h-16" />
                      <span className="text-body-small font-medium">
                        Saved!
                      </span>
                    </div>
                  )}

                  {saveStatus === "error" && (
                    <div className="flex items-center gap-8 text-red-500">
                      <AlertCircle className="w-16 h-16" />
                      <span className="text-body-small font-medium">
                        {email && !isValidEmail(email)
                          ? "Please enter a valid email"
                          : "Failed to save"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Future Settings Placeholder */}
              <div className="px-24 py-16 border-t border-border-faint bg-background-base">
                <p className="text-mono-x-small font-mono text-black-alpha-32">
                  More notification options (SMS, Slack, Discord) coming soon...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
