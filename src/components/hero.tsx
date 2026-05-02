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
      <section className="container mx-auto max-w-4xl mb-12 px-4">
        <Skeleton className="w-full aspect-[4/5] sm:aspect-[21/9] rounded-[32px]" />
      </section>
    );
  }

  return (
    <section className="container mx-auto max-w-4xl mb-12 px-4">
      <div className="relative w-full aspect-[4/5] sm:aspect-[21/9] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white/10 group">
        <Image
          src={heroImage}
          alt="Hero Banner"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
