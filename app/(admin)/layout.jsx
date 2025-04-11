import Header from "@/components/header";
import Sidebar from "@/app/(admin)/admin/_components/sidebar";
import { getAdmin } from "@/actions/admin";
import { notFound } from "next/navigation";

export default async function AdminLayout({ children }) {
  const admin = await getAdmin();

        if (!admin?.authorized) {
          return notFound();
        }
        // console.log(admin);
        return (
          <div className="h-full">
            <Header isAdminPage={true} />
            <div className="flex h-full w-56 flex-col top-20 fixed inset-y-0 z-50">
              <Sidebar />
            </div>
            <main className="md:pl-56 pt-[80px] h-full">{children}</main>
          </div>
        );
}