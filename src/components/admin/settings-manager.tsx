"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Save, ImageIcon, Upload } from "lucide-react";
import { getPublicImageUrl } from "@/lib/utils";
import Image from "next/image";
import { useSettingsManager } from "@/hooks/use-settings-manager";

export function SettingsManager() {
  const {
    isLoading,
    formData,
    setFormData,
    uploading,
    handleFileUpload,
    handleSubmit,
    isUpdating,
  } = useSettingsManager();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-8">
          <Card className="rounded-[32px] border-none shadow-sm overflow-hidden bg-card">
            <CardHeader className="bg-muted/50 pb-8 pt-8 px-8">
              <CardTitle className="text-2xl font-black">Brand & Appearance</CardTitle>
              <p className="text-sm text-muted-foreground">Customize your store look and feel.</p>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Field>
                  <FieldLabel>Store Logo</FieldLabel>
                  <div className="flex items-center gap-4">
                    <div className="relative size-20 rounded-2xl border-2 border-dashed border-border bg-muted overflow-hidden flex items-center justify-center shrink-0">
                      {formData.logo ? (
                        <Image src={getPublicImageUrl(formData.logo)} alt="Logo" fill className="object-contain p-2" />
                      ) : (
                        <ImageIcon className="size-6 text-muted-foreground/30" />
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "logo")}
                        disabled={!!uploading}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById("logo-upload")?.click()}
                        className="rounded-full font-bold"
                        disabled={!!uploading}
                      >
                        {uploading === "logo" ? <Spinner className="size-4 mr-2" /> : <Upload className="size-4 mr-2" />}
                        Upload Logo
                      </Button>
                      <p className="text-[10px] text-muted-foreground">PNG preferred, transparent bg.</p>
                    </div>
                  </div>
                </Field>

                <Field>
                  <FieldLabel>Hero Banner Image</FieldLabel>
                  <div className="flex flex-col gap-4">
                    <div className="relative w-full aspect-[21/9] rounded-2xl border-2 border-dashed border-border bg-muted overflow-hidden flex items-center justify-center">
                      {formData.heroImage ? (
                        <Image src={getPublicImageUrl(formData.heroImage)} alt="Hero" fill className="object-cover" />
                      ) : (
                        <ImageIcon className="size-8 text-muted-foreground/30" />
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <Input
                        id="hero-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "heroImage")}
                        disabled={!!uploading}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById("hero-upload")?.click()}
                        className="rounded-full font-bold"
                        disabled={!!uploading}
                      >
                        {uploading === "heroImage" ? <Spinner className="size-4 mr-2" /> : <Upload className="size-4 mr-2" />}
                        Change Hero Banner
                      </Button>
                      <p className="text-[10px] text-muted-foreground">Recommended: 1920x800px</p>
                    </div>
                  </div>
                </Field>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border-none shadow-sm overflow-hidden bg-card">
            <CardHeader className="bg-muted/50 pb-8 pt-8 px-8">
              <CardTitle className="text-2xl font-black">Contact & Payment</CardTitle>
              <p className="text-sm text-muted-foreground">Manage your contact and payment information across the platform.</p>
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
                    className="rounded-2xl"
                  />
                  <FieldDescription>Used for &quot;WhatsApp Order&quot; redirects and Quick Buy.</FieldDescription>
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field>
                    <FieldLabel htmlFor="bkash">bKash Personal Number</FieldLabel>
                    <Input
                      id="bkash"
                      placeholder="017XXXXXXXX"
                      value={formData.bkashNumber}
                      onChange={(e) => setFormData({ ...formData, bkashNumber: e.target.value })}
                      className="rounded-2xl border-pink-500/20 focus-visible:border-pink-500"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="nagad">Nagad Personal Number</FieldLabel>
                    <Input
                      id="nagad"
                      placeholder="018XXXXXXXX"
                      value={formData.nagadNumber}
                      onChange={(e) => setFormData({ ...formData, nagadNumber: e.target.value })}
                      className="rounded-2xl border-orange-500/20 focus-visible:border-orange-500"
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
                    className="rounded-2xl"
                  />
                </Field>
              </FieldGroup>
            </CardContent>
            <CardFooter className="p-8 bg-muted/30">
              <Button
                type="submit"
                disabled={isUpdating || !!uploading}
                className="w-full rounded-full py-7 text-sm font-black uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02]"
              >
                {isUpdating && <Spinner className="mr-2" data-icon="inline-start" />}
                {isUpdating ? "Saving..." : <><Save data-icon="inline-start" /> Save All Changes</>}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
