# 2KCUT Saloon

2KCUT Saloon is a premium digital presence for **2KCUT Salon By Kamal**, a luxury barber shop located in Galle, Sri Lanka. This high-performance marketing website focuses on precision grooming, styling, and a luxury customer experience.

## 🚀 Tech Stack

### Frontend
- **Framework:** [Next.js 16.2.6](https://nextjs.org/) (Custom version with specific API considerations)
- **Library:** [React 19.2.4](https://react.dev/)
- **Styling:** [Tailwind CSS 4.0](https://tailwindcss.com/) with `@tailwindcss/postcss`
- **Animations:** [GSAP (GreenSock Animation Platform)](https://gsap.com/)
- **Icons:** [Lucide React](https://lucide.dev/) & Material Symbols
- **UI Components:** [Radix UI](https://www.radix-ui.com/) (Avatar, Dropdown, Popover)

### Backend & Authentication
- **Authentication:** [NextAuth.js v5 (Beta)](https://next-auth.js.org/)
- **Auth Provider:** [Keycloak](https://www.keycloak.org/)
- **API Communication:** Custom client-fetch logic targeting an external API.

### Design
- **Typography:** Hanken Grotesk (Sans) and Libre Caslon Text (Serif) via `next/font`.
- **Palette:** Luxury dark theme (Black: `#050505`, Gold: `#d4af37`, Off-white: `#eae1d4`).

## ✨ Features

- **Interactive Landing Page:** GSAP-powered animations and scroll triggers.
- **Booking Flow:** Multi-step booking process for services and barbers.
- **Admin Dashboard:** Management interface for bookings and salon operations.
- **Branding Bar:** Infinite scrolling animated bar for premium partner logos.
- **Client Trust:** "Voices of Excellence" testimonials section.
- **SEO Optimized:** Implemented `LocalBusiness` (BarberShop) JSON-LD schema.
- **Responsive Design:** Luxury experience across all device sizes.

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+
- npm (standard)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd 2kcut_saloon
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
# NextAuth Configuration
AUTH_SECRET=your-next-auth-secret # Run 'npx auth secret' to generate
AUTH_KEYCLOAK_ID=your-keycloak-client-id
AUTH_KEYCLOAK_SECRET=your-keycloak-client-secret
AUTH_KEYCLOAK_ISSUER=your-keycloak-issuer-url

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:7080/api/v1
```

### Running Locally

Start the development server with Webpack:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Build & Deployment

### Production Build

To create an optimized production build:

```bash
npm run build
```

### Deployment

#### Vercel (Recommended)
The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new).

1. Import your repository to Vercel.
2. Configure the Environment Variables listed above.
3. Vercel will automatically detect the Next.js framework and build the project.

#### Self-Hosting (Node.js)
You can host the application on any server that supports Node.js.

```bash
npm run build
npm run start
```

#### Docker Deployment
This application includes a multi-stage `Dockerfile` optimized for Next.js standalone output.

1. Build the Docker image:
   ```bash
   docker build -t 2kcut-saloon .
   ```

2. Run the Docker container, providing the necessary environment variables:
   ```bash
   docker run -p 3000:3000 \
     -e AUTH_SECRET="your-next-auth-secret" \
     -e AUTH_KEYCLOAK_ID="your-keycloak-client-id" \
     -e AUTH_KEYCLOAK_SECRET="your-keycloak-client-secret" \
     -e AUTH_KEYCLOAK_ISSUER="your-keycloak-issuer-url" \
     -e NEXT_PUBLIC_API_URL="http://localhost:7080/api/v1" \
     2kcut-saloon
   ```
   *Note: In a production environment, it is recommended to pass environment variables using a `.env` file (`--env-file`) or your container orchestration platform's secret manager.*

## 📂 Project Structure

- `app/`: Next.js App Router directory.
  - `admin/`: Admin dashboard routes.
  - `booking-flow/`: Multi-step booking application.
  - `api/auth/`: NextAuth route handlers.
- `components/`: Reusable React components.
  - `booking/`: Components specific to the booking process.
  - `ui/`: Shared UI primitives (Radix UI wrappers).
- `hooks/`: Custom React hooks (e.g., `use-booking`).
- `lib/`: Utility functions and API client.
- `public/`: Static assets (images, logos).
- `themes/`: Custom theme properties and styles.

## 📖 Development Guidelines

- **Next.js Version:** This project uses a version of Next.js that may have breaking changes compared to standard versions. Refer to `node_modules/next/dist/docs/` for specific API guidance.
- **GSAP:** All animations should use GSAP for consistency. Register plugins like `ScrollTrigger` in the component or layout.
- **Styling:** Follow the luxury dark-theme palette. Pay close attention to typography (tracking, leading) and spacing.
- **Images:** Use `next/image` for all images. Ensure remote patterns in `next.config.ts` are updated for new hostnames.

## 🤝 Contributing

Contributions are welcome! Please follow the existing code style and ensure all changes are tested.

---
© 2026 2KCUT Saloon. All Rights Reserved.
