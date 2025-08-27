import { Inngest } from "inngest";
import User from "../models/User.js";
export const inngest = new Inngest({ id: "movie-tiket-booking" });

//inngest function to save user data to database
const syncUserCreation = inngest.createFunction(
  {id: 'sync-user-from-clerk'},
  {event: 'cleark/user.created'},
  async({ event }) =>{
     const {id, first_name, last_name, email_addresses, image_url} = event.data
     const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + ' ' + last_name,
      image: image_url

     }
     await User.create(userData)
  }
)

//inngest function to delete data from database

const syncUserDeletion = inngest.createFunction(
  {id: 'delete-user-with-clerk'},
  {event: 'cleark/user.deleted'},
  async({ event }) =>{
    const {id} = event.data
    await User.findByIdAndDelete(id)
  }
)


//inngest function to Update data from database

const syncUserUpdation = inngest.createFunction(
  {id: 'update-user-from-clerk'},
  {event: 'cleark/user.updated'},
  async({ event }) =>{
    const {id, first_name, last_name, email_addresses, image_url} = event.data
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + ' ' + last_name,
      image: image_url

     }
     await User.findByIdAndUpdate(id,userData)
  }
)



export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion
];