"use client";
import React, { JSX, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { DotButton, useDotButton } from "./carouselDotButton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

export function ImageCarousel({ contents }: { contents: JSX.Element[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3000 })
  ],);
  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <>
      <div className="relative overflow-hidden mt-8 lg:mx-8">
        <div className="embla bg-background" ref={emblaRef}>
          <div className="embla__container">
            {contents.map((content: JSX.Element, index) => (
              <div className="embla__slide flex basis-full min-w-0 justify-center" key={index}>
                {content}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between mx-4 py-4">
        <div className="flex items-center">
          <button className="embla__prev" onClick={scrollPrev}>
            <ChevronLeft className="h-8 w-8 m-2 [&_path]:stroke-1 [&_path]:stroke-foreground/50 hover:cursor-pointer hover:[&_path]:stroke-foreground" />
          </button>
          <button className="embla__next" onClick={scrollNext}>
            <ChevronRight className="h-8 w-8 m-2 [&_path]:stroke-1 [&_path]:stroke-foreground/50 hover:cursor-pointer hover:[&_path]:stroke-foreground" />
          </button>
        </div>
        <div className="flex justify-end items-center gap-2 mx-4">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={`${index === selectedIndex ? "bg-foreground" : "bg-foreground/50"
                } w-2 h-2 cursor-pointer rounded-xl`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
