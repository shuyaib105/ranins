import imageCompression from "browser-image-compression";
import { SupabaseClient } from "@supabase/supabase-js";

export async function uploadOptimizedImage(
  supabase: SupabaseClient,
  file: File,
  prefix: string = "img"
) {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    fileType: "image/webp",
  };

  try {
    const compressedFile = await imageCompression(file, options);
    
    // browser-image-compression returns a Blob/File. 
    // We want to ensure it has the .webp extension
    const fileName = `${prefix}_${crypto.randomUUID()}.webp`;
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET!;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, compressedFile, {
        contentType: "image/webp",
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { publicUrl: publicData.publicUrl, path: data.path };
  } catch (error) {
    console.error("Image optimization/upload failed:", error);
    throw error;
  }
}
