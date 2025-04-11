import { checkUser } from "@/lib/checkUser";
import Header from "./header";

export default async function AuthProvider({ isAdminPage = false, searchParams }) {
  const inviteToken = searchParams?.token;
  const user = await checkUser(inviteToken);
  const isAdmin = user?.role === "ADMIN";

  return <Header isAdminPage={isAdminPage} initialUser={user} initialIsAdmin={isAdmin} />;
}