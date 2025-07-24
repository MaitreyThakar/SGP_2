# Copilot Instructions for FinPredict Stock Market Analysis

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a comprehensive stock market analysis and prediction website built with Next.js, JavaScript, and Tailwind CSS. The application provides:

- **Multi-Market Support**: Indian Stock Market (NSE/BSE), US Stock Market (NYSE/NASDAQ), and Cryptocurrency markets
- **Price Prediction**: ML-powered stock and crypto price predictions
- **Interactive Dashboard**: Real-time data visualization and analytics
- **Professional UI**: Modern, responsive design with Tailwind CSS

## Code Style Guidelines
- Use functional components with React hooks
- Implement proper component composition and reusability
- Follow Next.js App Router conventions
- Use Tailwind CSS for all styling
- Maintain TypeScript-like JSDoc comments for better code documentation
- Implement proper error handling and loading states
- Use semantic HTML elements for accessibility

## Component Structure
- Create reusable components in `src/components/`
- Organize by feature: `common/`, `markets/`, `dashboard/`, `prediction/`
- Use proper prop validation and default values
- Implement responsive design patterns

## API Integration
- Use Next.js API routes for backend functionality
- Implement proper data fetching with loading and error states
- Use React Query or SWR for data caching and synchronization
- Handle real-time data updates appropriately

## Performance Considerations
- Implement proper code splitting and lazy loading
- Optimize images and assets
- Use Next.js Image component for optimization
- Implement proper caching strategies
