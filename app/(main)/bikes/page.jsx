import { CarFilters } from "./_components/bike-filters";
import { getCarFilters } from "@/actions/bike-listing";
import { BIkeListings } from "./_components/bikes-listing";

export const metadata = {
  title: "Bikes | KMR",
  description: "Browse and search for your dream bike",
};

export default async function BikesPage() {
  // Fetch filters data on the server
  const filtersData = await getCarFilters();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl mb-4 gradient-title">⫍‍⌕‍⫎ bikes</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Section */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <CarFilters filters={filtersData.data} />
        </div>

        {/* Bike Listings */}
        <div className="flex-1">
          <BIkeListings />
        </div>
      </div>
    </div>
  );
}
