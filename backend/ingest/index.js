import { Inngest } from "inngest";
import User from "../models/User.js"; // Your Mongoose model

export const inngest = new Inngest({ id: "movie-ticket-booking" });

// ---------------------
// Function: Create User
// ---------------------
const syncUserCreation = inngest.createFunction(
  { id: 'sync-user-from-clerk' },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;

      // Prepare user data for database
      const userData = {
        _id: id, // Use Clerk user ID as MongoDB _id (ensure your schema allows string)
        email: email_addresses?.[0]?.email_address || "",
        name: `${first_name} ${last_name}`,
        image: image_url || ""
      };

      // Save to MongoDB
      const newUser = await User.create(userData);
      console.log("✅ User created in DB:", newUser);
    } catch (err) {
      console.error("❌ Error creating user in DB:", err);
    }
  }
);

// ---------------------
// Function: Update User
// ---------------------
const syncUserUpdation = inngest.createFunction(
  { id: 'update-user-from-clerk' },
  { event: 'clerk/user.updated' },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;

      const userData = {
        email: email_addresses?.[0]?.email_address || "",
        name: `${first_name} ${last_name}`,
        image: image_url || ""
      };

      // Update existing user in DB
      const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });
      console.log("✅ User updated in DB:", updatedUser);
    } catch (err) {
      console.error("❌ Error updating user in DB:", err);
    }
  }
);

// ---------------------
// Function: Delete User
// ---------------------
const syncUserDeletion = inngest.createFunction(
  { id: 'delete-user-with-clerk' },
  { event: 'clerk/user.deleted' },
  async ({ event }) => {
    try {
      const { id } = event.data;

      // Delete user from DB
      const deletedUser = await User.findByIdAndDelete(id);
      console.log("✅ User deleted from DB:", deletedUser);
    } catch (err) {
      console.error("❌ Error deleting user from DB:", err);
    }
  }
);

// Export all functions
export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion
];
