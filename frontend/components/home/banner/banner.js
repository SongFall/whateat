"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const Banner = () => {
  // 轮播状态管理
  const slides = [
    {
      title: "Nike React",
      subtitle: "Rewriting sport's playbook for billions of athletes",
      image:
        "https://images.unsplash.com/photo-1615615228002-890bb61cac6e?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Nike sports equipment",
    },
    {
      title: "CoolApps",
      subtitle: "From mobile apps to gaming consoles",
      image:
        "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Mobile apps and gaming consoles",
    },
    {
      title: "Grumpy",
      subtitle: "Bringing Art to everything",
      image:
        "https://images.unsplash.com/photo-1629666451094-8908989cae90?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Artistic designs showcase",
    },
  ];

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 3000,
        }),
      ]}
    >
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index} className="w-full">
            <div className="relative h-[400px] sm:h-[500px] md:h-[700px] w-full overflow-hidden rounded-2xl">
              <img
                src={slide.image}
                alt={slide.alt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 sm:p-8">
                <div className="max-w-xl">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                    {slide.title}
                  </h2>
                  <p className="text-white/90 text-sm sm:text-base mb-4">{slide.subtitle}</p>
                  <Link
                    href="#"
                    className="inline-flex items-center justify-center px-4 py-2 bg-white text-black font-medium rounded-md hover:bg-white/90 transition-colors w-auto"
                  >
                    了解更多
                  </Link>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default Banner;
