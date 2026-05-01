import Image from "next/image";

export function Hero() {
  return (
    <section className="container mx-auto max-w-4xl mb-12 px-4">
      <div className="relative w-full aspect-[4/5] sm:aspect-[21/9] rounded-3xl overflow-hidden shadow-lg">
        <Image
          src="https://raw.githubusercontent.com/shuyaib105/ranins-/refs/heads/main/20%25%20off%20.webp"
          alt="20% Off Sale"
          fill
          className="object-cover"
          priority
        />
      </div>
    </section>
  );
}
