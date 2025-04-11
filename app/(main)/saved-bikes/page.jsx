import { getSavedBikes } from "@/actions/bike-listing";
import { SavedBikesList } from "./_components/saved-bikes-list";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Saved Bikes | KMR",
  description: "View your saved bikes and favorites",
};

export default async function SavedBikesPage() {
  // Check authentication on server
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect=/saved-bikes");
  }

  // Fetch saved bikes on the server
  const savedBikesResult = await getSavedBikes();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl mb-6 gradient-title">your saved bikes</h1>
      <SavedBikesList initialData={savedBikesResult} />
    </div>
  );
}
