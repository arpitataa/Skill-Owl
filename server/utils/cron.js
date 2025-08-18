const cron = require("node-cron");
const Profile = require("../models/Profile");
const User = require("../models/User");

cron.schedule('0 0 * * *',  async () => {
    const now = new Date();
    try{
        const profilesToDelete = await Profile.find({
            pendingDeletion: true,
            deletionTime: { $lte: now }
        });
    for (const profile of profilesToDelete) {
        const user = await User.findOne({ additionalDetails: profile._id });
        await User.findByIdAndDelete(user._id);
        await Profile.findByIdAndDelete(profile._id);
        console.log("profile deleted")
    }
    }
    catch(error){
        console.log(error);
        
    }
})