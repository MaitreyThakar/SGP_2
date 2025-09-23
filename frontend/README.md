# FinPredict Stock Market Analysis

FinPredict is a comprehensive stock market analysis and prediction platform built with Next.js, JavaScript, and Tailwind CSS. It provides multi-market support, ML-powered price predictions, and a professional, responsive UI.

## Features

- **Multi-Market Support**: Analyze Indian (NSE/BSE), US (NYSE/NASDAQ), and Cryptocurrency markets.
- **Price Prediction**: AI/ML-powered predictions for stocks and cryptocurrencies.
- **Interactive Dashboard**: Real-time data visualization and analytics.
- **Professional UI**: Modern, responsive design using Tailwind CSS.
- **User Profiles**: Secure authentication and personalized trading preferences.
- **Pricing Plans**: Flexible subscription options for traders and institutions.

## Tech Stack

- **Frontend**: Next.js (App Router), React (functional components, hooks), Tailwind CSS
- **Backend**: Next.js API routes, Supabase (auth & database)
- **Data Fetching**: SWR/React Query (recommended for caching and synchronization)
- **Authentication**: Supabase Auth (email/password, Google OAuth)
- **Database**: Supabase Postgres (user profiles, trading data)
- **Performance**: Code splitting, lazy loading, Next.js Image optimization

## Folder Structure

```
src/
  components/
    common/        # Shared UI (Navbar, Footer, etc.)
    markets/       # Market-specific components
    dashboard/     # Dashboard and analytics
    prediction/    # Prediction tools
    profile/       # User profile management
  app/
    api/           # Next.js API routes
    ...            # App pages (pricing, login, signup, etc.)
  lib/             # Supabase client setup
```

## Coding Guidelines

- Use functional components and React hooks.
- Compose reusable components and organize by feature.
- Follow Next.js App Router conventions.
- Use Tailwind CSS for all styling.
- Add TypeScript-like JSDoc comments for documentation.
- Implement error handling and loading states.
- Use semantic HTML for accessibility.
- Optimize images and assets with Next.js Image.
- Use SWR/React Query for data fetching and caching.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Visit** [http://localhost:3000](http://localhost:3000) to explore the app.

## API & Database

- All backend logic is handled via Next.js API routes (`/src/app/api/`).
- Supabase is used for authentication and database (user profiles, trading data).
- See [`src/lib/supabase.js`](src/lib/supabase.js) for client setup.

## Contributing

- Follow the code style and folder structure guidelines.
- Add JSDoc comments to all components and functions.
- Use Tailwind CSS for all UI work.
- Submit PRs with clear descriptions and reference related issues.

## License

MIT
