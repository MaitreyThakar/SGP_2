"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

/**
 * ProtectedRoute component for route guarding with Supabase authentication.
 * Redirects to /login if user is not authenticated.
 * @param {React.ReactNode} children - Protected content to render
 * @returns {JSX.Element} Protected route wrapper
 */
export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Get current session from Supabase
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        console.log("Auth check - Session:", !!session, "Error:", error); // Debug log

        const authenticated = !!session && !error;

        setIsAuthenticated(authenticated);
        setIsLoading(false);

        if (!authenticated) {
          console.log("User not authenticated, redirecting to login"); // Debug log
          router.replace("/login");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
        setIsLoading(false);
        router.replace("/login");
      }
    };

    // Check authentication on mount
    checkAuthentication();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, !!session); // Debug log

      const authenticated = !!session;
      setIsAuthenticated(authenticated);
      setIsLoading(false);

      if (!authenticated && event === "SIGNED_OUT") {
        router.replace("/login");
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [router, supabase]);

  // Show loading state while checking authentication
  if (isLoading || isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <span className="text-lg font-semibold text-white">
            Checking authentication...
          </span>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated (redirect in progress)
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <span className="text-lg font-semibold text-white">
            Redirecting to login...
          </span>
        </div>
      </div>
    );
  }

  // User is authenticated, render protected content
  return <>{children}</>;
}