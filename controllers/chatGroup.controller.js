const Group = require("../models/chatGroup.model");
const User = require("../models/user.model");
const { v4: uuidv4 } = require("uuid");

const groupController = {
  createGroup: async (req, res) => {
    try {
      const newGroup = {
        groupName: req.body.groupName,
        groupAvatar: `https://avatars.dicebear.com/api/human/${Math.floor(Math.random() * 1000)}.svg`,
        groupId: uuidv4(),
        groupCreator: req.body.groupCreator,
      };
      let group = new Group(newGroup);
      await group.save();
      res.json({
        ok: true,
        message: "group created",
        group
      });
    } catch (error) {
      console.log(error);
    }
  },
  getAllGroups: async (req, res) => {
    try {
      const groups = await Group.find();
      res.json({
        ok: true,
        groups,
      });
    } catch (error) {
      console.log(error);
    }
  },
  getGroupById: async (req, res) => {
    try {
      console.log(req.params)
      const group = await Group.findById(req.params.chatId);
      res.json({
        ok: true,
        group,
      });
    } catch (error) {
      console.log(error);
    }
  },
  deleteGroupById: async (req, res) => {
    try {
      await Group.findByIdAndDelete(req.params.chatId);
      res.json({
        ok: true,
        message: "group deleted",
      });
    } catch (error) {
      console.log(error);
    }
  },
  addMessageByChatId: async (req, res) => {
    try {
      const newMessage = {
        ...req.body,
        dateCreated: new Date(),
      };
      const group = await Group.findById(req.params.chatId);
      console.log(group)
      group.groupMessages.push(newMessage);
      await group.save();
      res.json({
        ok: true,
        message: "message added",
        newMessage
      });
    } catch (error) {
      console.log(error);
    }
  },
  getAllMessagesOfGroupById: async (req, res) => {
    try {
      const group = await Group.findById(req.params.chatId);
      const messages = group.groupMessages;
      res.json({
        ok: true,
        messages,
      });
    } catch (error) {
      console.log(error);
    }
  },
  addUserToGroup: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        res.json({
          ok: false,
          message: "user doesnt exist or is not registered",
        });
        return
      };
      const group = await Group.findById(req.params.chatId);
      group.groupMembers.push(user);
      await group.save();
      res.json({
        ok: true,
        message: "user added",
      });
    } catch (error) {
      console.log(error);
    }
  },
  deleteUserFromGroup: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      const group = await Group.findById(req.params.chatId);
      group.groupMembers.pull(user);
      await group.save();
      res.json({
        ok: true,
        message: "user deleted",
      });
    } catch (error) {
      console.log(error);
    }
  },
  changeGroupNameById: async (req, res) => {
    try {
      const group = await Group.findByIdAndUpdate(req.params.chatId, {
        groupName: req.body.groupName,
      });
      res.json({
        ok: true,
        group,
      });
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = groupController;
