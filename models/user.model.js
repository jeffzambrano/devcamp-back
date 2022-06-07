const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
     type: String,
     default: null,
   },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
    default:
      "https://res.cloudinary.com/dzqbzqgqw/image/upload/v1599098981/avatar_default_qjyqjh.png",
  },
  created: {
    type: Date,
    default: Date.now,
  },
  magicLink: {
    type: String,
    default: "",
  },
  magicLinkExpired: {
    type: Boolean,
    default:false,
  },
  status:{
    type: Boolean,
    default:false,
  },
  groups: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: "GroupChat"}],
    default: [],
  },
});

module.exports = mongoose.model("User", userSchema);
