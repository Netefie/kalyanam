"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Lightbox from "./Lightbox";

interface Props {
  image: string;
  images?: string[];
  title: string;
}

export default function ImageGallery({ image, images, title }: Props) {
  const [open, setOpen] = useState(false);

  // Rooms without a configured gallery still get a working viewer showing the
  // single main photo, so the button is never a dead control.
  const gallery = images && images.length > 0 ? images : [image];

  return (
    <>
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gray-100">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="
            group/btn
            absolute
            bottom-5
            left-5
            flex
            items-center
            gap-2
            rounded-full
            bg-white/90
            px-5
            py-2
            text-sm
            font-medium
            text-[#2d2d2d]
            shadow-sm
            backdrop-blur-sm
            transition
            hover:bg-white
            hover:shadow-md
          "
        >
          More Photos
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover/btn:translate-x-1"
          />
        </button>
      </div>

      {open && (
        <Lightbox
          images={gallery}
          title={title}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
