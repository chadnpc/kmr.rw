import { getBikeById } from "@/actions/bike-listing";
import { notFound } from "next/navigation";
import { TestDriveForm } from "./_components/test-drive-form";

export async function generateMetadata() {
  return {
    title: `Book Test Drive | KMR`,
    description: `Schedule a test drive in few seconds`,
  };
}

export default async function TestDrivePage({ params }) {
  // Fetch bike details
  const { id } = params;
  const result = await getBikeById(id);

  // If bike not found, show 404
  if (!result.success) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-6xl mb-6 gradient-title">Book a Test Drive</h1>
      <TestDriveForm
        bike={result.data}
        testDriveInfo={result.data.testDriveInfo}
      />
    </div>
  );
}
