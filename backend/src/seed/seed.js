// One-off seeder: creates the admin account and the initial room catalogue
// that currently lives as hardcoded data in the frontend.
// Run with:  npm run seed
import mongoose from "mongoose";
import { connectDB, disconnectDB } from "../config/db.js";
import { env } from "../config/env.js";
import { Admin } from "../models/Admin.js";
import { RoomType } from "../models/RoomType.js";

const rooms = [
  {
    name: "Deluxe Room",
    slug: "deluxe-room",
    description:
      "Elegantly designed rooms with modern interiors, premium amenities and scenic resort views.",
    image: "/rooms/deluxe.png",
    price: 5499,
    offerPrice: 4699,
    rating: 4.8,
    reviews: 214,
    size: "320 sq.ft",
    bed: "King Bed",
    maxGuests: 2,
    breakfast: true,
    cancellation: true,
    totalRooms: 12,
    availableRooms: 5,
    featured: true,
    active: true,
  },
  {
    name: "Super Deluxe Room",
    slug: "super-deluxe-room",
    description:
      "Spacious luxury accommodation perfect for families and leisure travellers.",
    image: "/rooms/deluxe.png",
    price: 7499,
    offerPrice: 6599,
    rating: 4.9,
    reviews: 189,
    size: "420 sq.ft",
    bed: "King Bed",
    maxGuests: 3,
    breakfast: true,
    cancellation: true,
    totalRooms: 10,
    availableRooms: 3,
    featured: false,
    active: true,
  },
  {
    name: "Luxury Suite",
    slug: "luxury-suite",
    description:
      "Our finest suite with expansive living space, curated interiors and premium services.",
    image: "/rooms/suite.jpg",
    price: 8999,
    offerPrice: 8999,
    rating: 5,
    reviews: 96,
    size: "650 sq.ft",
    bed: "King Bed",
    maxGuests: 4,
    breakfast: true,
    cancellation: true,
    totalRooms: 6,
    availableRooms: 2,
    featured: true,
    active: true,
  },
];

async function seed() {
  await connectDB();

  // Admin — upsert by email, only set the password when creating a new one so
  // re-seeding never silently resets a changed password.
  const existingAdmin = await Admin.findOne({ email: env.seedAdmin.email });
  if (existingAdmin) {
    console.log(`[seed] admin already exists: ${env.seedAdmin.email}`);
  } else {
    const admin = new Admin({
      name: env.seedAdmin.name,
      email: env.seedAdmin.email,
      password: env.seedAdmin.password,
    });
    await admin.save();
    console.log(`[seed] created admin: ${env.seedAdmin.email}`);
  }

  // Rooms — upsert by slug so re-running keeps the catalogue in sync.
  for (const room of rooms) {
    await RoomType.updateOne({ slug: room.slug }, { $set: room }, { upsert: true });
  }
  console.log(`[seed] upserted ${rooms.length} room types`);

  await disconnectDB();
  console.log("[seed] done");
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch(async (err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
