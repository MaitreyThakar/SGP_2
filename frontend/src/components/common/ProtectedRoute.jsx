"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import ProfileCompletion from "@/components/profile/ProfileCompletion";

/**
 * ProtectedRoute component with profile completion check
 * @param {React.ReactNode} children - Protected content to render
 * @param {boolean} requireCompleteProfile - Whether to require completed profile
 * @returns {JSX.Element} Protected route wrapper
 */
export default function ProtectedRoute({ children, requireCompleteProfile = true }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const supabase = createClient();

  /**
   * Fetches user profile data
   * @param {string} userId - User ID
   */
  const fetchProfile = async (userId) => {
    try {
      const response = await fetch('/api/profile');
      const result = await response.json();
      
      if (result.success && result.data) {
        setProfileData(result.data);
        setShowProfileCompletion(!result.data.profile_completed && requireCompleteProfile);
      } else {
        setShowProfileCompletion(requireCompleteProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setShowProfileCompletion(requireCompleteProfile);
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log("Auth check - Session:", !!session, "Error:", error);
        
        const authenticated = !!session && !error;
        
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          await fetchProfile(session.user.id);
        } else {
          router.replace("/login");
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
        setIsLoading(false);
        router.replace("/login");
      }
    };

    checkAuthentication();
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, !!session);
      
      const authenticated = !!session;
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        await fetchProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        router.replace("/login");
      }
      
      setIsLoading(false);
    });
    
    return () => {
      subscription?.unsubscribe();
    };
  }, [router, supabase, requireCompleteProfile]);

  /**
   * Handles profile completion
   * @param {Object} completedProfile - Completed profile data
   */
  const handleProfileComplete = (completedProfile) => {
    setProfileData(completedProfile);
    setShowProfileCompletion(false);
  };

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

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Show profile completion if required and not completed
  if (showProfileCompletion) {
    return <ProfileCompletion onComplete={handleProfileComplete} />;
  }

  // User is authenticated and profile is complete, render protected content
  return <>{children}</>;
}