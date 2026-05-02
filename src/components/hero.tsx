"use client";

import Image from "next/image";
import { useSettings } from "@/lib/queries/settings.query";
import { getPublicImageUrl } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

export function Hero() {
  const { data: settings, isLoading } = useSettings();
  
  const heroImage = settings?.heroImage 
    ? getPublicImageUrl(settings.heroImage) 
    : "https://raw.githubusercontent.com/shuyaib105/ranins-/refs/heads/main/20%25%20off%20.webp";

  if (isLoading) {
    return (
      <section className="w-full mb-12">
        <Skeleton className="w-full aspect-[16/9] sm:aspect-[2.4/1]" />
      </section>
    );
  }

  return (
    <section className="w-full mb-12">
      <Image
        src={heroImage}
        alt="Hero Banner"
        width={1920}
        height={800}
        className="w-full h-auto block"
        priority
      />
    </section>
  );
}





