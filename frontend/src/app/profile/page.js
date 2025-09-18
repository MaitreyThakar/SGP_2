import ProfilePage from '@/components/profile/ProfilePage';
import ProtectedRoute from "@/components/common/ProtectedRoute";


export const metadata = {
  title: "User Profile - FinPredict",
  description: "Manage your profile, portfolio, and trading preferences on FinPredict",
};

export default function Profile() {
  return (<ProtectedRoute><ProfilePage /></ProtectedRoute>);
}
