import { Inngest } from "inngest";
import User from "../models/User.js";

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

      const userData = {
        _id: id, // Ensure your schema allows string _id
        email: email_addresses?.[0]?.email_address || "",
        name: `${first_name} ${last_name}`,
        image: image_url || ""
      };

      await User.create(userData);
      console.log("✅ User created:", userData);
    } catch (err) {
      console.error("❌ Error syncing user creation:", err);
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

      const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });
      console.log("✅ User updated:", updatedUser);
    } catch (err) {
      console.error("❌ Error syncing user update:", err);
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
      const deletedUser = await User.findByIdAndDelete(id);
      console.log("✅ User deleted:", deletedUser);
    } catch (err) {
      console.error("❌ Error syncing user deletion:", err);
    }
  }
);

// Export all functions
export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion
];
