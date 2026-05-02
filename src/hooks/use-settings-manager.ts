"use client";

import { useState, useEffect } from "react";
import { useSettings, useUpdateSettings } from "@/lib/queries/settings.query";
import { toast } from "sonner";
import { createClient } from "@/lib/client";
import { deleteStorageImage } from "@/lib/utils";
import { uploadOptimizedImage } from "@/lib/api/upload";

export function useSettingsManager() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const [formData, setFormData] = useState({
    whatsappNumber: "",
    bkashNumber: "",
    nagadNumber: "",
    footerText: "",
    heroImage: "",
    logo: "",
  });

  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        whatsappNumber: settings.whatsappNumber || "",
        bkashNumber: settings.bkashNumber || "",
        nagadNumber: settings.nagadNumber || "",
        footerText: settings.footerText || "",
        heroImage: settings.heroImage || "",
        logo: settings.logo || "",
      });
    }
  }, [settings]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "heroImage" | "logo") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(field);
    try {
      const supabase = createClient();
      const { publicUrl } = await uploadOptimizedImage(supabase, file, field);

      const oldUrl = field === "heroImage" ? formData.heroImage : formData.logo;
      if (oldUrl) {
        await deleteStorageImage(supabase, oldUrl);
      }

      setFormData((prev) => ({ ...prev, [field]: publicUrl }));
      toast.success(`${field === "heroImage" ? "Hero image" : "Logo"} optimized and uploaded`);
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(`Upload failed: ${err.message || "Unknown error"}`);
    } finally {
      setUploading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings.mutateAsync({
        id: settings?.$id || "new",
        data: formData,
      });
      toast.success("Settings updated successfully");
    } catch (_error) {
      toast.error("Failed to update settings");
    }
  };

  return {
    settings,
    isLoading,
    formData,
    setFormData,
    uploading,
    handleFileUpload,
    handleSubmit,
    isUpdating: updateSettings.isPending,
  };
}
