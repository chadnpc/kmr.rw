import { BikesList } from "./_components/bike-list";

export const metadata = {
  title: "Bikes | KMR Admin",
  description: "Manage bikes in your marketplace",
};

export default function BikesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Bikes Management</h1>
      <BikesList />
    </div>
  );
}
