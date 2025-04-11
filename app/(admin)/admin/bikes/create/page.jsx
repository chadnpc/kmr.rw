import { AddBikeForm } from "./_components/add-bike-form";

export const metadata = {
  title: "Add New Bike | KMR Admin",
  description: "Add a new bike to the marketplace",
};

export default function AddCarPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Car</h1>
      <AddBikeForm />
    </div>
  );
}
