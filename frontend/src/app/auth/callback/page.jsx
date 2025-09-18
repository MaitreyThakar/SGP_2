'use client';

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

/**
 * Authentication callback page for OAuth providers
 * Handles the redirect after OAuth authentication
 */
export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          router.push('/login?error=callback_error')
          return
        }

        if (data.session) {
          // Redirect to profile page after successful OAuth callback
          router.push('/profile')
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Unexpected error:', error)
        router.push('/login?error=unexpected_error')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
        <p className="text-white mt-4">Completing authentication...</p>
      </div>
    </div>
  )
}