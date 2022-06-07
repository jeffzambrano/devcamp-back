const express = require("express");
const userController = require("../controllers/user.controller");
const chatGroupController = require("../controllers/chatGroup.controller");
const router = express.Router();

// main route

router.get("/", (req, res) => {
    res.send("Chat api accessed");
    }
);

//chat group routes

router.get("/chat", chatGroupController.getAllGroups);
router.post("/chat", chatGroupController.createGroup);
router.get("/chat/:chatId", chatGroupController.getGroupById);
router.delete("/chat/:chatId", chatGroupController.deleteGroupById);
router.post("/chat/:chatId/message", chatGroupController.addMessageByChatId);
router.get("/chat/:chatId/message", chatGroupController.getAllMessagesOfGroupById);
router.post("/chat/:chatId/user", chatGroupController.addUserToGroup);
router.delete("/chat/:chatId/user", chatGroupController.deleteUserFromGroup);


//user routes  

router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUserById);
router.post("/users/:id/groups", userController.addGroupToUser);
router.get("/users/:id/groups", userController.getAllGroupsFromUser);
router.delete("/users/:id/groups/:groupId", userController.removeGroupFromUser);


module.exports  = router;
