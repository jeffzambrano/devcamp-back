const User = require("../models/user.model");
const validator = require("validator");
const { v4: uuidv4 } = require("uuid");
const { sendMagicLink } = require("../utils/email");
const jwt = require("jsonwebtoken");

const userController = {
  createUser: async (email, name) => {
    try {
      const newUser = {
        email: email,
        magicLink: uuidv4(),
        name: name,
        avatar: `https://avatars.dicebear.com/api/human/${Math.floor( Math.random() * 1000 )}.svg`,
      };
      let user = new User(newUser);
      await user.save();
      sendMagicLink(email, user.magicLink, "signup");
    } catch (error) {
      console.log(error);
    }
  },
  loginUser: async (req, res) => {
    const { email, magicLink, name } = req.body;

    if (!email) {
      res.json({ ok: false, message: "please provide an email" });
    }
    if (!validator.isEmail(email)) {
      res.json({ ok: false, message: "please provide a valid email" });
    }
    try {
      const user = await User.findOne({ email });
      if (!user) {
        await userController.createUser(email, name);
        res.json({
          ok: true,
          message:
            "user created, please verify your email and click the link to sign in",
        });
      } else if (!magicLink) {
        try {
          const user = await User.findOneAndUpdate(
            { email },
            { magicLink: uuidv4(), magicLinkExpired: false },
            { new: true }
          );
          await sendMagicLink(email, user.magicLink);
          res.json({
            ok: true,
            message: "please verify your email and click the link to sign in",
            magicLink: user.magicLink,
          });
        } catch (error) {
          res.json({ ok: false, message: "something went wrong" });
        }
      } else if (user.magicLink === magicLink && !user.magicLinkExpired) {
        const loggedInUser = await User.findOne({ email });
        const user = {
          id: loggedInUser._id,
          email: loggedInUser.email,
          name: loggedInUser.name,
          avatar: loggedInUser.avatar,
      };
        
        const token = jwt.sign(
          { email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.json({ ok: true, message: "logged in", token: token, user: user });
      } else {
        res.json({ ok: false, message: "magic link expired" });
      }
    } catch (error) {
      console.log(error);
      res.json({ ok: false, message: "error" });
    }
  },
  verifyToken: async (req, res) => {
    const token = req.body.token;
    if (!token) {
      return res.json({ ok: false, message: "please provide a token" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, succ) => {
      err
      ? res.json({ ok: false, message: err, })
      : res.json({ ok: true, succ });
    });
  },
  logoutUser: async (req, res) => {
    const logOutParameters = {
      magicLinkExpired: true,
      status: false,
    };
    let user = await User.findOneAndUpdate(req.email, logOutParameters, {
      new: true,
    });
    res.json({ ok: true, message: "logged out", user });
  },
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.json({
        ok: true,
        user,
      });
    } catch (error) {
      console.log(error);
      res.json({ ok: false, message: "error" });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.json({
        ok: true,
        users,
      });
    } catch (error) {
      console.log(error);
      res.json({ ok: false, message: "error" });
    }
  },
  updateUser: async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.json({
        ok: true,
        user,
      });
    } catch (error) {
      console.log(error);
      res.json({ ok: false, message: "error" });
    }
  },
  deleteUserById: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.json({
        ok: true,
        user,
      });
    } catch (error) {
      console.log(error);
      res.json({ ok: false, message: "error" });
    }
  },
  addGroupToUser: async (req, res) => {
    try {
      const user = await User.findOneById(req.params.id).populate("groups");
      const group = await Group.findById(req.params.id);
      user.groups.push(group);
      await user.save();
      res.json({
        ok: true,
        user,
      });
    } catch (error) {
      console.log(error);
      res.json({ ok: false, message: "error" });
    }
  },
  removeGroupFromUser: async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { $pull: { groups: req.body.groupId } },
        { new: true }
      );
      res.json({
        ok: true,
        user,
      });
    } catch (error) {
      console.log(error);
      res.json({ ok: false, message: "error" });
    }
  },
  getAllGroupsFromUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).populate("groups");
      res.json({
        ok: true,
        user,
      });
    } catch (error) {
      console.log(error);
      res.json({ ok: false, message: "error" });
    }
  },
};

module.exports = userController;
