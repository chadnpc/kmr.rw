import { getBikeById } from "@/actions/bike-listing";
import { BikeDetails } from "./_components/bike-details";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const result = await getBikeById(id);

  if (!result.success) {
    return {
      title: "Bike Not Found | KMR",
      description: "The requested bike could not be found",
    };
  }

  const bike = result.data;

  return {
    title: `${bike.year} ${bike.make} ${bike.model} | KMR`,
    description: bike.description.substring(0, 160),
    openGraph: {
      images: bike.images?.[0] ? [bike.images[0]] : [],
    },
  };
}

export default async function BikeDetailsPage({ params }) {
  // Fetch bike details
  const { id } = await params;
  const result = await getBikeById(id);

  // If bike not found, show 404
  if (!result.success) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <BikeDetails bike={result.data} testDriveInfo={result.data.testDriveInfo} />
    </div>
  );
}
