"use client";

import React, { forwardRef, useRef } from "react";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import Image from 'next/image';  
import IconTriste from '../../public/enfant.png'
import IconHeureux from '../../public/epanouissement-personnel.png'

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = 'Circle'; 
export function AnimatedBeamDemo() {
    const containerRef = useRef<HTMLDivElement>(null);
    const div1Ref = useRef<HTMLDivElement>(null);
    const div2Ref = useRef<HTMLDivElement>(null);
  
    return (
      <div
        className="relative flex w-full max-w-[500px] items-center justify-center overflow-hidden rounded-lg  p-10 "
        ref={containerRef}
      >
        <div className="flex h-full w-full flex-col justify-between gap-10">
          <div className="flex flex-row justify-between">
            <Circle ref={div1Ref}>
              <Image src={IconTriste} alt="Triste" width={160} height={160} />  {/* Ajuster la taille si nécessaire */}
            </Circle>
            <Circle ref={div2Ref}>
              <Image src={IconHeureux} alt="Heureux" width={160} height={160} />  {/* Ajuster la taille si nécessaire */}
            </Circle>
          </div>
        </div>
  
        <AnimatedBeam
          duration={3}
          containerRef={containerRef}
          fromRef={div1Ref}
          toRef={div2Ref}
        />
      </div>
    );
  }
  
