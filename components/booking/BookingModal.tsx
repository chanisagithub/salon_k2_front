"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

export default function BookingModal({ onClose }: { onClose: () => void }) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Entrance animation
    gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 });
    gsap.fromTo(modalRef.current, 
      { opacity: 0, scale: 0.95, y: 30 }, 
      { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power3.out" }
    );

    // Listen for close message from iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'closeBooking') {
        closeWithAnim();
      }
    };
    window.addEventListener('message', handleMessage);

    // Lock body scroll
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('message', handleMessage);
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const closeWithAnim = () => {
    gsap.to(modalRef.current, { opacity: 0, scale: 0.95, y: 20, duration: 0.3 });
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.3, onComplete: onClose });
  };

  if (!mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center pointer-events-none">
      {/* Backdrop - Intercepts clicks */}
      <div 
        ref={backdropRef}
        onClick={closeWithAnim}
        className="absolute inset-0 bg-black/90 backdrop-blur-xl pointer-events-auto"
        style={{ willChange: 'opacity' }}
      />

      {/* Modal Container */}
      <div 
        ref={modalRef}
        className="relative w-[95vw] md:w-[90vw] lg:w-[85vw] h-[90vh] md:h-[85vh] bg-background border border-outline-variant shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col pointer-events-auto"
        style={{ willChange: 'transform, opacity' }}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center px-8 h-20 border-b border-outline-variant bg-surface-container-low shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <div className="font-serif text-xl uppercase tracking-[0.3em] text-primary">Master Ritual Journey</div>
          </div>
          
          <button 
            onClick={closeWithAnim}
            className="group flex items-center gap-4 text-on-surface-variant hover:text-primary transition-all duration-300"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-50 group-hover:opacity-100 group-hover:translate-x-[-4px] transition-all">Close Ritual</span>
            <div className="w-10 h-10 rounded-full border border-outline-variant group-hover:border-primary flex items-center justify-center transition-all">
              <span className="material-symbols-outlined text-xl">close</span>
            </div>
          </button>
        </div>

        {/* Iframe Content - Absolute fill of the container */}
        <div className="flex-1 bg-background relative overflow-hidden">
          <iframe 
            src="/booking-flow" 
            className="absolute inset-0 w-full h-full border-none"
            title="2KCUT Booking Journey"
            allow="payment"
          />
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
