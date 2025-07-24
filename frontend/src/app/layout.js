import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export const metadata = {
  title: "FinPredict - Professional Stock Market Analysis",
  description: "Advanced AI-powered stock market analysis and prediction platform for Indian, US, and Crypto markets. Get real-time data, predictions, and professional trading tools.",
  keywords: "stock market, trading, investment, AI predictions, Indian stocks, US stocks, cryptocurrency, market analysis",
  authors: [{ name: "FinPredict Team" }],
  creator: "FinPredict",
  publisher: "FinPredict",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
