const { Inngest } = require("inngest");
const connectDB = require("../configs/db");
const User = require("../models/User");

const inngest = new Inngest({ id: "movie-ticket-booking" });

// Create user
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },   // ✅ FIXED
  async ({ event }) => {
    await connectDB();

    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name} ${last_name}`,
      image: image_url,
    };

    await User.create(userData);
    console.log("✅ User created:", userData);
  }
);

// Delete user
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },   // ✅ FIXED
  async ({ event }) => {
    await connectDB();

    const { id } = event.data;
    await User.findByIdAndDelete(id);
    console.log("🗑️ User deleted:", id);
  }
);

// Update user
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },   // ✅ FIXED
  async ({ event }) => {
    await connectDB();

    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name} ${last_name}`,
      image: image_url,
    };

    await User.findByIdAndUpdate(id, userData, { new: true, upsert: true });
    console.log("♻️ User updated:", userData);
  }
);

const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation];

module.exports = { inngest, functions };
