import { notFound } from "next/navigation";
import { Sidebar } from "./admin/_components/sidebar";
import { getAdmin } from "@/actions/admin";
import Header from "@/components/header";
// import { redirect } from 'next/navigation';
import AuthProvider from '@/components/auth-provider';

export default async function AdminLayout({ children }) {
  const admin = await getAdmin();
  return (
    <AuthProvider isAdminPage>
      {({ initialUser, initialIsAdmin }) => {
        if (!initialUser || !initialIsAdmin || !admin.authorized) {
          // If user not found in our db or not an admin, redirect to 404
          return notFound();
          // return redirect('/');
        }
        return <div className="h-full">
          <Header isAdminPage={true} />
          <div className="flex h-full w-56 flex-col top-20 fixed inset-y-0 z-50">
            <Sidebar />
          </div>
          <main className="md:pl-56 pt-[80px] h-full">{children}</main>
        </div>;
      }}
    </AuthProvider>
  );
}