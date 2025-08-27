const { Inngest } = require("inngest");
const User = require("../models/User");

// Create a client to send and receive events
const inngest = new Inngest({ id: "movie-ticket-booking" });

//ingest function to save user data to a database
const syncUserCreation =  inngest.createFunction(
    {id: 'sync-user-from-cleark'},
    {event: 'cleark/user.crated'},
    async ({event}) =>{
        const {id, first_name, last_name, email_address, image_url} = event.data

        const userData = {
            _id: id,
            email: email_address[0].email_address,
            name: first_name + ' ' + last_name,
            image: image_url
        }

        await User.create(userData)
    }
)

//ingest function to Delete user data from database

const syncUserDeletion =  inngest.createFunction(
    {id: 'delete-user-with-cleark'},
    {event: 'cleark/user.deleted'},
    async ({event}) =>{
      
        const {id} = event.data
        await User.findByIdAndDelete(id)
    }
)

//ingest function to Update user data from database

const syncUserUpdation =  inngest.createFunction(
    {id: 'update-user-from-cleark'},
    {event: 'cleark/user.updated'},
    async ({event}) =>{
        const {id, first_name, last_name, email_address, image_url} = event.data

        const userData = {
            _id: id,
            email: email_address[0].email_address,
            name: first_name + ' ' + last_name,
            image: image_url
        }

        await User.findByIdAndUpdate(id, userData)
    }
)


// Create an empty array where we'll export future Inngest functions
const functions = [
    syncUserCreation, 
    syncUserDeletion,
    syncUserUpdation
    ];

module.exports = { inngest, functions };
