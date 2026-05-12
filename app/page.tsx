"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BookingButton from "@/components/booking/BookingButton";
import UserMenu from "@/components/providers/UserMenu";

gsap.registerPlugin(ScrollTrigger);

const heroImage =
  "/images/hero-background.png";

const masterImage =
  "/images/barber.png";

const brands = [
  "/images/brands/Aesop-logo.png",
  "/images/brands/Alessandro-Logo-500x281.png",
  "/images/brands/Align-Logo-500x281.png",
  "/images/brands/Alpecin-Logo-500x313.png",
  "/images/brands/Always-Logo-500x281.png",
  "/images/brands/AmorePacific-Logo-500x281.png",
  "/images/brands/Amouage.png",
  "/images/brands/Ariel-Logo-500x281.png",
  "/images/brands/Aussie-Logo-500x281.png",
  "/images/brands/Avon-Logo-500x281.png",
  "/images/brands/Carex-Logo-500x281.png",
  "/images/brands/Clearasil-logo-500x270.png",
  "/images/brands/Concept-Eyes-Logo-500x282.png",
  "/images/brands/Discreet-Logo-500x313.png",
  "/images/brands/Dove-logo-500x281.png",
  "/images/brands/Fructis-Logo-500x313.png",
  "/images/brands/Gillette-logo-500x300.png",
];

const services = [
  {
    marker: "01",
    title: "Hair Styling",
    copy: "From classic tapers to contemporary fades, precision cut to suit your unique face shape and lifestyle.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBzVGKe2AvlN5FSAa5ffNxxN0eAbE2IXs6ESE-kmMDj9ojfTcklzhEvhV7_eXxUEi3yKNv08Hw7fzt5tvkYwLhmJKbipU0LNZ82vrbY8zp7KJgm0tMYvohNDoHC0hrTJWQydtOaO5wMXaY5RPaCru4NftzY0_ouJNCywNIpfbMu0GtFwZQDJKHZLilgaGI2Sb7c-uEVfy2Pk-o15nxrEcqTrm321B-KYM6T598AU0ny7bxPco92_a3ANndvzefNk067JqdfEET9nQSw",
    alt: "Textured crop haircut with a sharp fade in moody salon lighting",
  },
  {
    marker: "02",
    title: "Beard Sculpting",
    copy: "Hot towel shaves and expert beard shaping using premium oils and traditional straight razor techniques.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBgqmqtSzfyykXJATvxMI1thcOwk1-W1h24PbPyB-WSvXK4zIfZ_oJWCr_GtsTjJrihWPRVOEt6nED-65T7bf7bAY8FETFUdCV-_v-wkVeVItSHpNn8ZePfti90kOpcpZZVC5wLWCJLtdKyV2x-Ms2EukQ9mX9XXQEa0f92ndU19jnHRlFzLracRAEKM3Tu63CkuX0EMJqQcxAsLj_FgNiLvVoJCInuJdCx60mSUaub90AEpRJ9Ap5HTHn2z37fgHUk28g1zSXLl6P1",
    alt: "Close-up straight razor shave with premium grooming detail",
  },
  {
    marker: "03",
    title: "Groom Packages",
    copy: "Full concierge service for your big day. Hair, beard, facial, and styling for grooms and groomsmen.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_WYX3diSsEtwKnWvzc4YoV5rb8bFgP5sqI78Efb551_rYGBfHs6mZKDn4nDU4RdFeqo2BLXVY2TOI6w-BLDUOxCa4gG3u8gEXLUBhK42NK6wsNpingIDAhnQVQf81tWP442gqy7mnhxTkZsYoXTxMWKk2t-ZhRTm9vRte1S2od7bHxoIb7TbFfPXdvuKhoytoyDwJdeNSzi0A-JwJPkSgmr5jw9MKkeVru8_DmykfFDIs3PDxgaT4dJ6t6ednIQJugLj5ck5X4HJb",
    alt: "Professional barber tools arranged on a charcoal surface",
  },
];

const gallery = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzVGKe2AvlN5FSAa5ffNxxN0eAbE2IXs6ESE-kmMDj9ojfTcklzhEvhV7_eXxUEi3yKNv08Hw7fzt5tvkYwLhmJKbipU0LNZ82vrbY8zp7KJgm0tMYvohNDoHC0hrTJWQydtOaO5wMXaY5RPaCru4NftzY0_ouJNCywNIpfbMu0GtFwZQDJKHZLilgaGI2Sb7c-uEVfy2Pk-o15nxrEcqTrm321B-KYM6T598AU0ny7bxPco92_a3ANndvzefNk067JqdfEET9nQSw",
    alt: "Textured crop haircut with a sharp fade in moody salon lighting",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgqmqtSzfyykXJATvxMI1thcOwk1-W1h24PbPyB-WSvXK4zIfZ_oJWCr_GtsTjJrihWPRVOEt6nED-65T7bf7bAY8FETFUdCV-_v-wkVeVItSHpNn8ZePfti90kOpcpZZVC5wLWCJLtdKyV2x-Ms2EukQ9mX9XXQEa0f92ndU19jnHRlFzLracRAEKM3Tu63CkuX0EMJqQcxAsLj_FgNiLvVoJCInuJdCx60mSUaub90AEpRJ9Ap5HTHn2z37fgHUk28g1zSXLl6P1",
    alt: "Close-up straight razor shave with premium grooming detail",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_WYX3diSsEtwKnWvzc4YoV5rb8bFgP5sqI78Efb551_rYGBfHs6mZKDn4nDU4RdFeqo2BLXVY2TOI6w-BLDUOxCa4gG3u8gEXLUBhK42NK6wsNpingIDAhnQVQf81tWP442gqy7mnhxTkZsYoXTxMWKk2t-ZhRTm9vRte1S2od7bHxoIb7TbFfPXdvuKhoytoyDwJdeNSzi0A-JwJPkSgmr5jw9MKkeVru8_DmykfFDIs3PDxgaT4dJ6t6ednIQJugLj5ck5X4HJb",
    alt: "Professional barber tools arranged on a charcoal surface",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBV2Sxdy_DuZme7kDdvodUZdmXw0_qwENbWOCEEhUPHhHrdr0O_mEJMqlhALsnJGymCA0BwFCO2YygzOWjrb40oGjNxqHJbtImsa11DNycwPi_veqQmEhQ5pFYs7pTE9dETQPZUvu50Tx5GIihqe_239cJCh6zDU06rmmVjqFwl4cZqbg-TrNM2UESFG8vyN14VfhTYOGvZEAvbAwfV3Y-UrdY-UMJ9PyJJ6uSCYcsm8Eabv-ExX-0CMlztKpV7K8NkBid2fqZy1WGN",
    alt: "Luxury barber shop interior with leather chairs and gold-framed mirrors",
  },
];

const stats = [
  ["20+", "YEARS EXP"],
  ["15K+", "CUSTOMERS"],
  ["100%", "SATISFACTION"],
];

const testimonials = [
  {
    quote: "The best grooming experience in Galle. Kamal's attention to detail is unmatched. It's more than a haircut; it's a ritual.",
    author: "James W.",
    role: "Regular Client",
  },
  {
    quote: "Found my go-to spot for beard sculpting. The hot towel shave is incredible. Highly recommended for anyone visiting Sri Lanka.",
    author: "David R.",
    role: "Digital Nomad",
  },
  {
    quote: "They handled our entire wedding party with such professionalism. Every one of us looked sharp and felt like a VIP.",
    author: "Sarath K.",
    role: "Groom",
  },
];

const faqs = [
  {
    question: "Do I need to book an appointment?",
    answer: "While we welcome walk-ins when possible, we highly recommend booking in advance to ensure Master Kamal is available for your preferred time.",
  },
  {
    question: "What are your signature services?",
    answer: "Our '2KCUT Signature' includes a precision hair style and a traditional hot towel straight-razor shave with premium essential oils.",
  },
  {
    question: "Do you offer wedding packages?",
    answer: "Yes, we specialize in groom and groomsmen styling. We can accommodate full wedding parties with a private session.",
  },
];

export default function Home() {
  const tickerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mainRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Hero Text Reveal (Masked)
      gsap.from(".hero-reveal", {
        y: 120,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out",
        stagger: 0.1,
        delay: 0.5,
      });

      // 2. Cinematic Scroll Reveals
      const revealSections = document.querySelectorAll(".reveal-section");
      revealSections.forEach((section) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: "top 90%",
            toggleActions: "play none none none",
          },
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });
      });

      // 3. Staggered Grid Items
      const gridSections = [
        { trigger: "#services", items: ".service-card" },
        { trigger: "#stats-container", items: ".stat-item" },
        { trigger: "#testimonials", items: ".testimonial-card" },
        { trigger: "#gallery", items: ".gallery-item" },
      ];

      gridSections.forEach((grid) => {
        gsap.from(grid.items, {
          scrollTrigger: {
            trigger: grid.trigger,
            start: "top 85%",
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
        });
      });

      // 4. Branding Bar Loop
      if (tickerRef.current) {
        const ticker = tickerRef.current;
        const tickerContent = ticker.querySelector(".ticker-content");
        if (tickerContent) {
          const clone = tickerContent.cloneNode(true);
          ticker.appendChild(clone);
          const animation = gsap.to([tickerContent, clone], {
            xPercent: -100,
            repeat: -1,
            duration: window.innerWidth < 768 ? 20 : 40,
            ease: "none",
          });
          ticker.addEventListener("mouseenter", () => animation.pause());
          ticker.addEventListener("mouseleave", () => animation.play());
        }
      }

      // 5. Magnetic Buttons (Desktop Only)
      if (window.innerWidth >= 1024) {
        const magneticContainers = document.querySelectorAll(".magnetic-container");
        magneticContainers.forEach((container) => {
          const btn = container.querySelector(".magnetic-btn");
          if (!btn) return;

          container.addEventListener("mousemove", (e: any) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, {
              x: x * 0.4,
              y: y * 0.4,
              duration: 0.4,
              ease: "power2.out",
            });
          });

          container.addEventListener("mouseleave", () => {
            gsap.to(btn, {
              x: 0,
              y: 0,
              duration: 0.6,
              ease: "elastic.out(1, 0.3)",
            });
          });
        });
      }
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="opacity-0 transition-opacity duration-500" style={{ opacity: 1 }}>
      <main className="min-h-screen bg-[#050505] text-[#eae1d4]">
        <nav className="fixed left-0 top-0 z-50 flex w-full items-center justify-between border-b border-[#d4af37]/60 bg-[#050505]/95 px-5 py-4 backdrop-blur md:px-20">
          <a
            href="#home"
            className="relative block h-12 w-12 md:h-16 md:w-16 overflow-hidden rounded-full transition-transform hover:scale-110"
            aria-label="2KCUT Salon home"
          >
            <Image
              src="/images/2kcut-logo.png"
              alt="2KCUT Salon logo"
              width={64}
              height={64}
              className="h-full w-full rounded-full object-cover"
              quality={100}
              unoptimized
              priority
            />
          </a>
          <div className="hidden items-center gap-8 lg:flex">
            {["Services", "About", "Gallery", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-xs font-bold uppercase tracking-[0.15em] text-[#d0c5af] transition-colors hover:text-[#f2ca50]"
              >
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4 md:gap-8">
            <UserMenu />
            <div className="magnetic-container p-1">
              <BookingButton
                className="magnetic-btn border border-[#d4af37] bg-[#d4af37] px-4 py-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-[#241a00] transition-shadow hover:shadow-[0_0_24px_rgba(212,175,55,0.35)] md:px-6 inline-block"
              >
                Book
              </BookingButton>
            </div>
          </div>
        </nav>


        <section
          id="home"
          className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 pt-20"
        >
          <Image
            src={heroImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-55 saturate-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/20" />
          <div className="relative z-10 max-w-4xl text-center">
            <div className="overflow-hidden">
              <p className="hero-reveal mb-4 md:mb-5 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#f2ca50]">
                2KCUT Salon By Kamal
              </p>
            </div>
            <div className="overflow-hidden">
              <h1 className="hero-reveal font-serif text-4xl leading-tight text-[#eae1d4] md:text-7xl">
                Precision Grooming &amp; Styling
              </h1>
            </div>
            <div className="overflow-hidden">
              <p className="hero-reveal mx-auto mt-6 max-w-2xl text-base md:text-lg leading-relaxed md:leading-8 text-[#d0c5af]">
                Galle&apos;s premier destination for expert hair and beard care. We
                blend traditional craftsmanship with modern luxury.
              </p>
            </div>
            <div className="hero-reveal mt-10 md:mt-12 flex flex-col justify-center items-center gap-4 sm:flex-row">
              <div className="magnetic-container sm:p-2 lg:p-4">
                <BookingButton
                  className="magnetic-btn w-full sm:w-auto border border-[#f2ca50] bg-[#f2ca50] px-8 md:px-10 py-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-[#241a00] transition-shadow hover:shadow-[0_0_24px_rgba(242,202,80,0.35)] inline-block"
                >
                  Book an Appointment
                </BookingButton>
              </div>
              <div className="magnetic-container sm:p-2 lg:p-4">
                <a
                  href="#services"
                  className="magnetic-btn w-full sm:w-auto border border-[#eae1d4] px-8 md:px-10 py-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-[#eae1d4] transition-colors hover:bg-[#eae1d4] hover:text-[#16130b] inline-block"
                >
                  Explore Services
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="border-y border-[#d4af37]/20 bg-[#0a0a0a] py-8 md:py-12 overflow-hidden">
          <div className="mx-auto mb-6 md:mb-8 max-w-7xl px-5 text-center">
            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4af37]/60">
              Premium Brands We Carry
            </p>
          </div>
          <div ref={tickerRef} className="flex whitespace-nowrap">
            <div className="ticker-content flex items-center gap-12 md:gap-20 px-10">
              {brands.map((brand, i) => (
                <div key={i} className="relative h-8 w-24 md:h-12 md:w-32 flex-shrink-0 grayscale opacity-40 transition-all hover:grayscale-0 hover:opacity-100">
                  <Image
                    src={brand}
                    alt="Partner Brand"
                    fill
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <section id="services" className="bg-black px-5 py-20 md:py-24 md:px-20">
          <div className="reveal-section mx-auto mb-10 md:mb-14 max-w-7xl text-center">
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#f2ca50]">
              The Menu
            </p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl text-[#eae1d4]">
              Curated Grooming Services
            </h2>
          </div>
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.title}
                className="service-card overflow-hidden border border-[#2a2a2a] bg-[#1a1a1a]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover grayscale transition-transform duration-700 hover:scale-110 hover:grayscale-0"
                  />
                </div>
                <div className="p-6 md:p-8 text-center">
                  <p className="mx-auto mb-6 flex h-12 w-12 md:h-14 md:w-14 items-center justify-center border border-[#d4af37] text-xs md:text-sm font-bold tracking-[0.15em] text-[#f2ca50]">
                    {service.marker}
                  </p>
                  <h3 className="font-serif text-xl md:text-2xl text-[#eae1d4]">
                    {service.title}
                  </h3>
                  <p className="mt-4 min-h-20 md:min-h-24 text-sm md:text-base leading-relaxed md:leading-7 text-[#d0c5af]">
                    {service.copy}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="about"
          className="overflow-hidden bg-[#1f1b13] px-5 py-20 md:py-24 md:px-20"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 md:gap-14 md:grid-cols-2">
            <div className="reveal-section relative">
              <div className="absolute -inset-2 md:-inset-4 border border-[#d4af37]/25" />
              <div className="relative aspect-[4/5] border border-[#2a2a2a]">
                <Image
                  src={masterImage}
                  alt="Master Barber Kamal at work"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover grayscale transition duration-700 hover:grayscale-0"
                />
              </div>
            </div>
            <div id="stats-container" className="reveal-section">
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#f2ca50]">
                Meet the Expert
              </p>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl lg:text-6xl leading-tight text-[#eae1d4]">
                The Visionary: Master Kamal
              </h2>
              <p className="mt-6 md:mt-8 text-base md:text-lg leading-relaxed md:leading-8 text-[#d0c5af]">
                With over two decades of experience, Kamal has redefined the
                grooming landscape in Galle. His chair is a sanctuary of precision
                where old-world mastery meets contemporary aesthetics.
              </p>
              <p className="mt-4 md:mt-5 text-sm md:text-base leading-relaxed md:leading-7 text-[#d0c5af]">
                Specializing in VIP client care and high-profile wedding party
                styling, Kamal ensures every guest leaves with a 2KCUT, a
                signature mark of excellence that speaks volumes before you even
                say a word.
              </p>
              <div className="mt-8 md:mt-10 flex flex-wrap gap-6 md:gap-8">
                {stats.map(([value, label]) => (
                  <div key={label} className="stat-item">
                    <p className="font-serif text-2xl md:text-3xl text-[#f2ca50]">{value}</p>
                    <p className="mt-1 md:mt-2 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-[#d0c5af]/70">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="bg-black px-5 py-20 md:py-24 md:px-20">
          <div className="reveal-section mx-auto mb-10 md:mb-14 max-w-3xl text-center">
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#f2ca50]">
              Testimonials
            </p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl text-[#eae1d4]">
              Voices of Excellence
            </h2>
          </div>
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:gap-8 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card border border-[#2a2a2a] bg-[#0a0a0a] p-8 md:p-10">
                <div className="mb-4 md:mb-6 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[#d4af37] text-sm">★</span>
                  ))}
                </div>
                <p className="italic text-sm md:text-base leading-relaxed text-[#d0c5af]">&quot;{t.quote}&quot;</p>
                <div className="mt-6 md:mt-8">
                  <p className="font-bold text-sm md:text-base text-[#eae1d4]">{t.author}</p>
                  <p className="text-[10px] uppercase tracking-widest text-[#d4af37]">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="reveal-section mt-10 md:mt-12 text-center">
            <div className="magnetic-container inline-block">
              <a
                href="https://maps.app.goo.gl/3YZMDG9hHQLjVoaL9"
                target="_blank"
                rel="noreferrer"
                className="magnetic-btn inline-flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37] transition-colors hover:text-[#f2ca50]"
              >
                <span>View All Google Reviews</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            </div>
          </div>
        </section>

        <section id="gallery" className="bg-black py-20 md:py-24">
          <div className="reveal-section mx-auto mb-10 md:mb-14 max-w-7xl px-5 text-center md:px-20">
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#f2ca50]">
              Gallery
            </p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl text-[#eae1d4]">
              Precision in Every Frame
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-px md:grid-cols-4">
            {gallery.map((image) => (
              <div
                key={image.src}
                className="gallery-item relative aspect-[4/5] overflow-hidden bg-[#111111]"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover grayscale transition duration-500 hover:scale-110 hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="reveal-section bg-[#050505] px-5 py-20 md:py-24 md:px-20">
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 md:mb-14 text-center">
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#f2ca50]">
                Questions
              </p>
              <h2 className="mt-3 font-serif text-3xl md:text-4xl text-[#eae1d4]">
                Common Inquiries
              </h2>
            </div>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-[#2a2a2a] pb-6 transition-colors hover:border-[#f2ca50]">
                  <h3 className="font-serif text-lg md:text-xl text-[#eae1d4]">{faq.question}</h3>
                  <p className="mt-3 text-sm md:text-base leading-relaxed text-[#d0c5af]">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="reveal-section flex flex-col items-center bg-[#d4af37] px-5 py-20 md:py-24 text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight text-[#241a00]">
            Experience the Master&apos;s Touch
          </h2>
          <div className="magnetic-container mt-8">
            <BookingButton
              className="magnetic-btn bg-black px-10 md:px-12 py-5 text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-[#f2ca50] transition-transform hover:scale-105 inline-block"
            >
              Book Your Experience
            </BookingButton>
          </div>
        </section>

        <footer
          id="contact"
          className="border-t border-[#4d4635] bg-[#110e07] px-5 py-16 md:py-20 md:px-20"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:gap-12 lg:grid-cols-4">
            <div>
              <div className="relative h-16 w-16 md:h-20 md:w-20 overflow-hidden rounded-full transition-transform hover:scale-110">
                <Image
                  src="/images/2kcut-logo.png"
                  alt="2KCUT Salon logo"
                  width={80}
                  height={80}
                  className="h-full w-full rounded-full object-cover"
                  quality={100}
                  unoptimized
                />
              </div>
              <p className="mt-5 text-sm md:text-base leading-relaxed md:leading-7 text-[#d0c5af]">
                Precisely crafted in the heart of Galle. Redefining modern
                grooming standards through heritage techniques.
              </p>
            </div>
            <div>
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-[#f2ca50]">
                The Location
              </p>
              <p className="mt-5 text-sm md:text-base leading-relaxed md:leading-7 text-[#eae1d4]">
                No: 25 B3 Richmond Hill Road,
                <br />
                Galle 80000
              </p>
              <p className="mt-2 text-xs md:text-sm text-[#d0c5af]">Plus code: 26Q5+8F, Galle</p>
              <div className="relative mt-5 h-40 overflow-hidden border border-[#2a2a2a]">
                <iframe
                  src="https://www.google.com/maps?q=6.038332017049708,80.20869087550312&z=17&output=embed"
                  title="2KCUT Salon location map"
                  className="h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a
                href="https://www.google.com/maps?q=6.038332017049708,80.20869087550312"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-[#f2ca50] hover:text-[#eae1d4]"
              >
                Open in Google Maps
              </a>
            </div>
            <div>
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-[#f2ca50]">
                Operating Hours
              </p>
              <ul className="mt-5 space-y-2 text-xs md:text-sm text-[#d0c5af]">
                <li className="flex justify-between border-b border-[#2a2a2a] pb-1">
                  <span>Mon - Fri</span>
                  <span className="text-[#eae1d4]">9:00 AM - 8:00 PM</span>
                </li>
                <li className="flex justify-between border-b border-[#2a2a2a] pb-1">
                  <span>Saturday</span>
                  <span className="text-[#eae1d4]">8:30 AM - 9:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-[#eae1d4]">9:00 AM - 6:00 PM</span>
                </li>
              </ul>
              <p className="mt-8 text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-[#f2ca50]">
                Contact Us
              </p>
              <ul className="mt-4 space-y-3 text-sm md:text-base text-[#eae1d4]">
                <li>
                  <a href="tel:0777603514" className="hover:text-[#f2ca50]">
                    0777 603 514
                  </a>
                </li>
                <li>
                  <a href="tel:0760948345" className="hover:text-[#f2ca50]">
                    0760 948 345
                </a>
                </li>
                <li>
                  <a
                    href="mailto:salon2kcut@gmail.com"
                    className="hover:text-[#f2ca50]"
                  >
                    salon2kcut@gmail.com
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-[#f2ca50]">
                Social
              </p>
              <div className="mt-5 flex flex-col gap-4 text-sm md:text-base">
                <a
                  href="https://www.instagram.com/2kcut/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#d0c5af] hover:text-[#f2ca50]"
                >
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/p/2KCUT-SALON-BY-KAMAL-100063768745111/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#d0c5af] hover:text-[#f2ca50]"
                >
                  Facebook
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#d0c5af] hover:text-[#f2ca50]"
                >
                  TikTok
                </a>
              </div>
              <p className="mt-12 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-[#d0c5af]/50">
                (c) 2026 2KCUT Salon By Kamal. Precisely crafted in Galle.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

