# 2KCUT Saloon - Project Context

## Project Overview
2KCUT Saloon is a premium digital presence for **2KCUT Salon By Kamal**, a luxury barber shop located in Galle, Sri Lanka. The project is a high-performance marketing website built with a modern web stack, focusing on precision grooming, styling, and a luxury customer experience.

### Core Technologies
- **Framework:** Next.js 16.2.6 (Note: This is a modified/future version, see "Critical Warnings" below)
- **Library:** React 19.2.4
- **Language:** TypeScript 5+
- **Animation:** GSAP (GreenSock Animation Platform)
- **Styling:** Tailwind CSS 4.0+ (using `@tailwindcss/postcss`)
- **Fonts:** Hanken Grotesk (Sans) and Libre Caslon Text (Serif) via `next/font`
- **Build Tool:** Turbopack (configured in `next.config.ts`)

## Critical Warnings & Conventions
- **Custom Next.js Version:** As noted in `AGENTS.md`, this project uses a version of Next.js that may have breaking changes compared to standard versions. Refer to `node_modules/next/dist/docs/` for specific API guidance.
- **Styling Strategy:** The project uses a luxury dark-theme palette:
  - Background: `#050505` (Black)
  - Primary Accents: `#d4af37` (Gold), `#f2ca50` (Bright Gold)
  - Text: `#eae1d4` (Off-white), `#d0c5af` (Beige)
- **Component Pattern:** Uses Next.js App Router. Main landing page logic resides in `app/page.tsx`.

## Key Commands
- `npm run dev`: Starts the development server with Webpack (Note: `next dev --webpack`).
- `npm run build`: Builds the production application.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint for code quality checks.

## Project Structure
- `app/`: Next.js App Router directory (layout, page, globals).
  - `page.tsx`: Contains the main landing page, including Services, About, Testimonials, FAQ, and Gallery.
  - `layout.tsx`: Includes SEO-optimized JSON-LD structured data for `BarberShop`.
- `public/images/`: Local assets including the logo, hero background, and barber imagery.
- `.stitch/`: Design metadata and reference files from the "Stitch" design tool.

## New Features & Improvements
- **Social Integration:** Linked to active Facebook and Instagram profiles.
- **Branding Bar:** Added an infinite scrolling GSAP-animated bar for premium partner logos.
- **Client Trust:** Added a "Voices of Excellence" testimonials section.
- **User Clarity:** Added a "Common Inquiries" FAQ section and detailed Operating Hours.
- **SEO Optimization:** Implemented `LocalBusiness` (BarberShop) schema for better search visibility.

## Development Guidelines
- **Placeholder Data:** Testimonials, FAQs, and Operating Hours currently use placeholder data and should be updated once final client content is received.
- **Precision:** Maintain the high-end, luxury aesthetic. Pay close attention to typography (tracking, leading) and spacing.
- **Images:** Most images are served from Google User Content (`lh3.googleusercontent.com`). Ensure `next/image` is used for optimization.
- **Accessibility:** Maintain proper ARIA labels and semantic HTML (e.g., `article` for services, `nav`, `main`, `footer`).
