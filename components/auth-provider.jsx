import { checkUser } from "@/lib/checkUser";
import Header from "./header";

export default async function AuthProvider({ isAdminPage = false }) {
  const user = await checkUser();
  const isAdmin = user?.role === "ADMIN";

  return <Header isAdminPage={isAdminPage} initialUser={user} initialIsAdmin={isAdmin} />;
}