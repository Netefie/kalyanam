"use client";

import Image from "next/image";

interface Props {
  image: string;
  title: string;
}

export default function ImageGallery({
  image,
  title,
}: Props) {
  return (
    <div className="relative h-full min-h-320px">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
      />

      <button
        className="
        absolute
        bottom-5
        right-5
        bg-white/90
        px-5
        py-2
        rounded-full
        text-sm
        font-medium
        hover:bg-white
      "
      >
        More Photos →
      </button>
    </div>
  );
}