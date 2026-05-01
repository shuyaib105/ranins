import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPublicImageUrl(url: string | null | undefined) {
  if (!url) return "";
  if (url.includes("supabase.co") && url.includes("/object/") && !url.includes("/public/")) {
    return url.replace("/object/", "/object/public/");
  }
  return url;
}

export async function deleteStorageImage(supabase: any, url: string | null | undefined) {
  if (!url || !url.includes("supabase.co")) return;

  try {
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET!;
    // Extract the path after /bucket/
    // Example: https://.../object/public/images/random-uuid_image.png
    // We need: random-uuid_image.png
    const urlParts = url.split(`/${bucket}/`);
    if (urlParts.length < 2) return;
    
    const filePath = urlParts[1];
    const { error } = await supabase.storage.from(bucket).remove([filePath]);
    if (error) console.error("Failed to delete image from storage:", error);
  } catch (e) {
    console.error("Error in deleteStorageImage:", e);
  }
}
