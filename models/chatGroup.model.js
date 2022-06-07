const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const groupChatSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
  },
  groupAvatar: {
    type: String,
    default:
      "https://res.cloudinary.com/dzqbzqgqw/image/upload/v1599098981/avatar_default_qjyqjh.png",
  },
  groupId: {
    type: String,
    required: true,
  },
  groupCreator: {
    type: String,
    required: true,
  },
  groupMembers: [{}],
  groupMessages: [
    {
      message: String,
      sender: String,
      dateCreated: Date,
    },
  ],

});

const GroupChat = mongoose.model("GroupChat", groupChatSchema);
module.exports = GroupChat;
