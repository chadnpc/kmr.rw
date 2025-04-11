"use server";

import { serializeBikeData } from "@/lib/helpers";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Get simplified filters for the bike marketplace
 */
export async function getCarFilters() {
  try {
    // Get unique makes
    const makes = await db.bike.findMany({
      where: { status: "AVAILABLE" },
      select: { make: true },
      distinct: ["make"],
      orderBy: { make: "asc" },
    });

    // Get unique body types
    const bodyTypes = await db.bike.findMany({
      where: { status: "AVAILABLE" },
      select: { bodyType: true },
      distinct: ["bodyType"],
      orderBy: { bodyType: "asc" },
    });

    // Get unique fuel types
    const fuelTypes = await db.bike.findMany({
      where: { status: "AVAILABLE" },
      select: { fuelType: true },
      distinct: ["fuelType"],
      orderBy: { fuelType: "asc" },
    });

    // Get unique transmissions
    const transmissions = await db.bike.findMany({
      where: { status: "AVAILABLE" },
      select: { transmission: true },
      distinct: ["transmission"],
      orderBy: { transmission: "asc" },
    });

    // Get min and max prices using Prisma aggregations
    const priceAggregations = await db.bike.aggregate({
      where: { status: "AVAILABLE" },
      _min: { price: true },
      _max: { price: true },
    });

    return {
      success: true,
      data: {
        makes: makes.map((item) => item.make),
        bodyTypes: bodyTypes.map((item) => item.bodyType),
        fuelTypes: fuelTypes.map((item) => item.fuelType),
        transmissions: transmissions.map((item) => item.transmission),
        priceRange: {
          min: priceAggregations._min.price
            ? parseFloat(priceAggregations._min.price.toString())
            : 0,
          max: priceAggregations._max.price
            ? parseFloat(priceAggregations._max.price.toString())
            : 100000,
        },
      },
    };
  } catch (error) {
    throw new Error("Error fetching bike filters:" + error.message);
  }
}

/**
 * Get bikes with simplified filters
 */
export async function getBikes({
  search = "",
  make = "",
  bodyType = "",
  fuelType = "",
  transmission = "",
  minPrice = 0,
  maxPrice = Number.MAX_SAFE_INTEGER,
  sortBy = "newest", // Options: newest, priceAsc, priceDesc
  page = 1,
  limit = 6,
}) {
  try {
    // Get current user if authenticated
    const { userId } = await auth();
    let dbUser = null;

    if (userId) {
      dbUser = await db.user.findUnique({
        where: { clerkUserId: userId },
      });
    }

    // Build where conditions
    let where = {
      status: "AVAILABLE",
    };

    if (search) {
      where.OR = [
        { make: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (make) where.make = { equals: make, mode: "insensitive" };
    if (bodyType) where.bodyType = { equals: bodyType, mode: "insensitive" };
    if (fuelType) where.fuelType = { equals: fuelType, mode: "insensitive" };
    if (transmission)
      where.transmission = { equals: transmission, mode: "insensitive" };

    // Add price range
    where.price = {
      gte: parseFloat(minPrice) || 0,
    };

    if (maxPrice && maxPrice < Number.MAX_SAFE_INTEGER) {
      where.price.lte = parseFloat(maxPrice);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Determine sort order
    let orderBy = {};
    switch (sortBy) {
      case "priceAsc":
        orderBy = { price: "asc" };
        break;
      case "priceDesc":
        orderBy = { price: "desc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    // Get total count for pagination
    const totalBikes = await db.bike.count({ where });

    // Execute the main query
    const bikes = await db.bike.findMany({
      where,
      take: limit,
      skip,
      orderBy,
    });

    // If we have a user, check which bikes are wishlisted
    let wishlisted = new Set();
    if (dbUser) {
      const savedBikes = await db.userSavedBike.findMany({
        where: { userId: dbUser.id },
        select: { bikeId: true },
      });

      wishlisted = new Set(savedBikes.map((saved) => saved.bikeId));
    }

    // Serialize and check wishlist status
    const serializedBikes = bikes.map((bike) =>
      serializeBikeData(bike, wishlisted.has(bike.id))
    );

    return {
      success: true,
      data: serializedBikes,
      pagination: {
        total: totalBikes,
        page,
        limit,
        pages: Math.ceil(totalBikes / limit),
      },
    };
  } catch (error) {
    throw new Error("Error fetching bikes:" + error.message);
  }
}

/**
 * Toggle bike in user's wishlist
 */
export async function toggleSavedBike(bikeId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Check if bike exists
    const bike = await db.bike.findUnique({
      where: { id: bikeId },
    });

    if (!bike) {
      return {
        success: false,
        error: "Bike not found",
      };
    }

    // Check if bike is already saved
    const existingSave = await db.userSavedBike.findUnique({
      where: {
        userId_bikeId: {
          userId: user.id,
          bikeId,
        },
      },
    });

    // If bike is already saved, remove it
    if (existingSave) {
      await db.userSavedBike.delete({
        where: {
          userId_bikeId: {
            userId: user.id,
            bikeId,
          },
        },
      });

      revalidatePath(`/saved-bikes`);
      return {
        success: true,
        saved: false,
        message: "Bike removed from favorites",
      };
    }

    // If bike is not saved, add it
    await db.userSavedBike.create({
      data: {
        userId: user.id,
        bikeId,
      },
    });

    revalidatePath(`/saved-bikes`);
    return {
      success: true,
      saved: true,
      message: "Bike added to favorites",
    };
  } catch (error) {
    throw new Error("Error toggling saved bike:" + error.message);
  }
}

/**
 * Get bike details by ID
 */
export async function getBikeById(bikeId) {
  try {
    // Get current user if authenticated
    const { userId } = await auth();
    let dbUser = null;

    if (userId) {
      dbUser = await db.user.findUnique({
        where: { clerkUserId: userId },
      });
    }

    // Get bike details
    const bike = await db.bike.findUnique({
      where: { id: bikeId },
    });

    if (!bike) {
      return {
        success: false,
        error: "Bike not found",
      };
    }

    // Check if bike is wishlisted by user
    let isWishlisted = false;
    if (dbUser) {
      const savedBike = await db.userSavedBike.findUnique({
        where: {
          userId_bikeId: {
            userId: dbUser.id,
            bikeId,
          },
        },
      });

      isWishlisted = !!savedCar;
    }

    // Check if user has already booked a test drive for this bike
    const existingTestDrive = await db.testDriveBooking.findFirst({
      where: {
        bikeId,
        userId: dbUser.id,
        status: { in: ["PENDING", "CONFIRMED", "COMPLETED"] },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    let userTestDrive = null;

    if (existingTestDrive) {
      userTestDrive = {
        id: existingTestDrive.id,
        status: existingTestDrive.status,
        bookingDate: existingTestDrive.bookingDate.toISOString(),
      };
    }

    // Get dealership info for test drive availability
    const dealership = await db.dealershipInfo.findFirst({
      include: {
        workingHours: true,
      },
    });

    return {
      success: true,
      data: {
        ...serializeBikeData(bike, isWishlisted),
        testDriveInfo: {
          userTestDrive,
          dealership: dealership
            ? {
              ...dealership,
              createdAt: dealership.createdAt.toISOString(),
              updatedAt: dealership.updatedAt.toISOString(),
              workingHours: dealership.workingHours.map((hour) => ({
                ...hour,
                createdAt: hour.createdAt.toISOString(),
                updatedAt: hour.updatedAt.toISOString(),
              })),
            }
            : null,
        },
      },
    };
  } catch (error) {
    throw new Error("Error fetching bike details:" + error.message);
  }
}

/**
 * Get user's saved bikes
 */
export async function getSavedBikes() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Get the user from our database
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Get saved bikes with their details
    const savedBikes = await db.userSavedBike.findMany({
      where: { userId: user.id },
      include: {
        bike: true,
      },
      orderBy: { savedAt: "desc" },
    });

    // Extract and format bike data
    const bikes = savedBikes.map((saved) => serializeBikeData(saved.bike));

    return {
      success: true,
      data: bikes,
    };
  } catch (error) {
    console.error("Error fetching saved bikes:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
