import { redirect } from 'next/navigation';
import AuthProvider from '@/components/auth-provider';

export default function AdminLayout({ children }) {
  return (
    <AuthProvider isAdminPage>
      {({ initialUser, initialIsAdmin }) => {
        if (!initialUser || !initialIsAdmin) {
          return redirect('/');
        }
        return children;
      }}
    </AuthProvider>
  );
}