const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    gender: {
        type:String,
        trim:true,
    },
    dateOfBirth:{
        type:String,
        trim:true
    },
    about:{
        type:String,
        trim:true,
    },
    contactNumber:{
        type:Number,
        trim:true,
    },
    pendingDeletion: {
    type: Boolean,
    default: false,
    },
    deletionTime: {
    type: Date,
    default: null,
    },

});

module.exports = mongoose.model("Profile",profileSchema);