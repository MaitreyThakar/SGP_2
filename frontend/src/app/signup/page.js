import Signup from '@/components/auth/Signup';

/**
 * Signup page component
 * Provides user registration interface
 * @returns {JSX.Element} Signup page
 */
export default function SignupPage() {
  return <Signup />;
}

export const metadata = {
  title: 'Sign Up - FinPredict',
  description:
    'Create your FinPredict account to access comprehensive stock market analysis and AI-powered predictions.',
};