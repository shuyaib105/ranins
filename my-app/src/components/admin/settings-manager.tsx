"use client";

import { useState, useEffect } from "react";
import { useSettings, useUpdateSettings } from "@/lib/queries/settings.query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, RefreshCw } from "lucide-react";

export function SettingsManager() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const [formData, setFormData] = useState({
    whatsappNumber: "",
    bkashNumber: "",
    nagadNumber: "",
    footerText: "",
  });

  useEffect(() => {
    if (settings) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        whatsappNumber: settings.whatsappNumber || "",
        bkashNumber: settings.bkashNumber || "",
        nagadNumber: settings.nagadNumber || "",
        footerText: settings.footerText || "",
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings.mutateAsync({
        id: settings?.$id || "new",
        data: formData,
      });
      toast.success("Settings updated successfully");
    } catch (error) {
      toast.error("Failed to update settings");
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><RefreshCw className="h-8 w-8 animate-spin text-gray-300" /></div>;

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <Card className="rounded-[32px] border-none shadow-sm overflow-hidden bg-white">
          <CardHeader className="bg-gray-50/50 pb-8 pt-8">
            <CardTitle className="text-2xl font-black">Store Configuration</CardTitle>
            <p className="text-sm text-gray-500">Manage your contact and payment information across the platform.</p>
          </CardHeader>
          <CardContent className="p-8">
            <FieldGroup className="gap-8">
              <Field>
                <FieldLabel htmlFor="wa">WhatsApp Business Number</FieldLabel>
                <Input
                  id="wa"
                  placeholder="8801918318094"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  className="rounded-2xl h-12"
                />
                <FieldDescription>Used for &quot;WhatsApp Order&quot; redirects and Quick Buy.</FieldDescription>
              </Field>

              <div className="grid grid-cols-2 gap-6">
                <Field>
                  <FieldLabel htmlFor="bkash">bKash Personal Number</FieldLabel>
                  <Input
                    id="bkash"
                    placeholder="017XXXXXXXX"
                    value={formData.bkashNumber}
                    onChange={(e) => setFormData({ ...formData, bkashNumber: e.target.value })}
                    className="rounded-2xl h-12 border-pink-100 focus-visible:border-pink-500"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="nagad">Nagad Personal Number</FieldLabel>
                  <Input
                    id="nagad"
                    placeholder="018XXXXXXXX"
                    value={formData.nagadNumber}
                    onChange={(e) => setFormData({ ...formData, nagadNumber: e.target.value })}
                    className="rounded-2xl h-12 border-orange-100 focus-visible:border-orange-500"
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="footer">Footer Text</FieldLabel>
                <Input
                  id="footer"
                  placeholder="© 2026 Ranins. All rights reserved."
                  value={formData.footerText}
                  onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                  className="rounded-2xl h-12"
                />
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter className="p-8 bg-gray-50/30">
            <Button
              type="submit"
              disabled={updateSettings.isPending}
              className="w-full rounded-full py-7 text-sm font-black uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02]"
            >
              {updateSettings.isPending ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
