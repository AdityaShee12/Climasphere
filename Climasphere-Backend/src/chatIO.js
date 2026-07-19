import { app } from "./app.js";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import { User } from "./models/user/user.model.js";
import { Message } from "./models/chat/Message.models.js";
import { PostComment } from "./models/postComments/postComments.models.js";
import { Post } from "./models/post/post.models.js";
import { Notification } from "./models/user/notification.model.js";
import fs from "fs";
import dotenv from "dotenv";
import { FRONTEND_API } from "./Frontend_API.js";
import socket from "../../Climasphere-Frontend/src/sockets/socket.js";

dotenv.config({ path: "./.env" });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: FRONTEND_API,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let users = {},
  groups = {},
  postViewers = {};

io.on("connection", (socket) => {

  // User Joined on chat and see how many people are seeing my account
  socket.on("new-user-joined", async ({ senderId, userName }) => {
    socket.join(senderId);
    if (users[senderId]) {
      users[senderId].socketId = socket.id;
      users[senderId].name = userName;
      if (users[senderId].viewers) {
        users[senderId].viewers.map((viewerId) => {
          if (users[viewerId]?.selectedUser === senderId) {
            io.to(users[viewerId].id).emit("state", "online");
          }
        });
      }
    } else {
      users[senderId] = { id: senderId, name: userName, socketId: socket.id };
    }
  });

  // Check selected users are online or offline and relationship status, store previous sms,
  socket.on("reciever add", async ({ senderId, receiverId, receiverFullName }) => {
    try {
      if (senderId) {
        if (users[senderId]) {
          users[senderId].selectedUser = receiverId;
        }
        if (users[receiverId]) {
          if (users[receiverId].socketId) {
            if (users[receiverId].viewers) {
              users[receiverId].viewers.push(senderId);
            } else {
              users[receiverId].viewers = [senderId];
            }
            io.to(senderId).emit("state", "online");
          } else {
            if (users[receiverId].viewers) {
              users[receiverId].viewers.push(senderId);
            } else {
              users[receiverId].viewers = [senderId];
            }
            io.to(senderId).emit("state", "offline");
          }
        } else {
          users[receiverId] = {
            id: receiverId,
            name: receiverFullName,
            viewers: [senderId],
            socketId: null,
          };
          io.to(senderId).emit("state", "offline");
        }
        const otherUsers = await User.findById(senderId);

        const userList = Array.isArray(otherUsers?.otherUsers)
          ? otherUsers.otherUsers
          : [];

        if (userList?.length > 0) {
          let found = false;
          for (const user of userList) {
            if (user.id.toString() === receiverId) {
              found = true;
              if (user.relation === "reject") {
                io.to(senderId).emit("friends", {
                  requestState: "reject",
                  participantType: user.participantType,
                });
              } else if (user.relation === "sent") {
                io.to(senderId).emit("friends", {
                  requestState: "sent",
                  participantType: user.participantType,
                });
              } else if (user.relation === "friend") {
                io.to(senderId).emit("requestSender", {
                  data: user.participantType === "sender" ? "sender" : "receiver",
                });
                io.to(senderId).emit("friends", { requestState: "friend" });
                const chatData = await Message.findOne({
                  users: {
                    $all: [
                      { $elemMatch: { id: senderId } },
                      { $elemMatch: { id: receiverId } },
                    ],
                  },
                });
                if (chatData?.messages) {
                  for (const message of chatData.messages) {
                    io.to(senderId).emit("storedSms", message);
                  }
                }
              }
              break;
            }
          }
          if (!found) {
            io.to(senderId).emit("friends", { requestState: "noFriend" });
          }
        } else {
          io.to(senderId).emit("friends", { requestState: "noFriend" });
        }
      }
    } catch (error) {
      console.error("Socket Error:", error);
    }
  });

  socket.on("check after reload", ({ senderId, receiverId }) => {
    if (users[receiverId] && users[receiverId].socketId) {
      if (users[receiverId].viewers) {
        users[receiverId].viewers.push(senderId);
      } else {
        users[receiverId].viewers = [senderId];
      }
      io.to(senderId).emit("state", "online");
    } else {
      users[receiverId] = { viewers: [senderId], socketId: null };
      io.to(senderId).emit("state", "offline");
    }
  });

  // Sending message system
  socket.on("send message", async (data) => {
    try {
      const {
        senderId,
        fullName,
        senderAvatar,
        receiverId,
        receiverFullName,
        receiverAvatar,
        identifier,
        sms,
        fileName,
        fileType,
        fileBuffer,
      } = data;
      let buf;
      if (fileBuffer) {
        buf = Buffer.from(fileBuffer);
        const filePath = path.join(__dirname, "uploads", fileName);
        fs.writeFileSync(filePath, buf);
      }
      if (buf) {
        io.to(senderId).emit("last message", {
          senderId: receiverId,
          sms,
          fileType,
          fileName,
        });
        io.to(receiverId).emit("last message", {
          senderId: senderId,
          sms,
          fileType,
          fileName,
        });
      } else {
        io.to(senderId).emit("last message", { senderId: receiverId, sms });
        io.to(receiverId).emit("last message", { senderId: senderId, sms });
      }
      if (users[receiverId]) {
        if (users[receiverId].selectedUser === senderId) {
          io.to(receiverId).emit("receive message", {
            identifier,
            fileName,
            fileType,
            buf,
            sms,
          });
          let existingChat = await Message.findOne({
            "users.id": { $all: [senderId, receiverId] },
          });
          if (existingChat) {
            existingChat.messages.push({
              sender: { id: senderId },
              reciever: { id: receiverId },
              relation: "friend",
              identifier: identifier,
              text: sms,
              sender_delete: false,
              reciever_delete: false,
              file: {
                fileName,
                fileType,
                fileData: buf,
              },
              timestamp: Date.now(),
            });
            await existingChat.save();
          } else {
            let newChat = new Message({
              users: [
                { id: senderId, name: fullName, avatar: senderAvatar },
                { id: receiverId, name: receiverFullName, avatar: receiverAvatar },
              ],
              messages: [
                {
                  sender: { id: senderId },
                  reciever: { id: receiverId },
                  relation: "friend",
                  identifier,
                  text: sms,
                  sender_delete: false,
                  reciever_delete: false,
                  file: {
                    fileName,
                    fileType,
                    fileData: buf,
                  },
                  timestamp: Date.now(),
                },
              ],
            });
            await newChat.save();
          }
        }
      } else {
        try {
          const existingNotification = await Notification.findOne({
            "sender.id": senderId,
            "receiver.id": receiverId,
          });

          const newMessage = {
            identifier,
            text: sms,
            file: fileName ? { fileName, fileType, buf } : undefined,
            sender_delete: false,
            timestamp: Date.now(),
          };
          if (existingNotification) {
            await Notification.updateOne(
              { "sender.id": senderId, "receiver.id": receiverId },
              { $push: { messages: newMessage } },
            );
          } else {
            await Notification.create({
              sender: { id: senderId, name: fullName },
              receiver: { id: receiverId, name: receiverFullName },
              identifier,
              messages: [newMessage],
            });
          }
        } catch (error) {
          console.error("Error saving notification:", error);
        }
      }
    } catch (err) {
      console.error("Message Transfer Error:", err);
    }
  });

  // Sending Friend Request
  socket.on("sendRequest", async (data) => {
    const {
      senderId,
      userName,
      senderAvatar,
      receiverId,
      receiverFullName,
      receiverAvatar,
    } = data;

    // Sender side
    await User.findByIdAndUpdate(senderId, {
      $addToSet: {
        otherUsers: {
          id: receiverId,
          fullName: receiverFullName,
          avatar: receiverAvatar,
          relation: "sent",
          participantType: "sender",
        },
      },
    });

    // Receiver side
    await User.findByIdAndUpdate(receiverId, {
      $addToSet: {
        otherUsers: {
          id: senderId,
          fullName: userName,
          avatar: senderAvatar,
          relation: "sent",
          participantType: "receiver",
        },
      },
    });

    io.to(receiverId).emit("friends", {
      requestState: "sent",
      participantType: "receiver",
    });
  });

  // Accept Friend Request
  socket.on("acceptRequest", async (data) => {
    const { senderId, receiverId, accept } = data;

    const relation = accept === 1 ? "friend" : "reject";

    // User side
    await User.findOneAndUpdate(
      { _id: senderId, "otherUsers.id": receiverId },
      {
        $set: {
          "otherUsers.$.relation": relation,
          "otherUsers.$.participantType": "receiver",
        },
      },
    );
    // Receiver side
    await User.findOneAndUpdate(
      { _id: receiverId, "otherUsers.id": senderId },
      {
        $set: {
          "otherUsers.$.relation": relation,
          "otherUsers.$.participantType": "sender",
        },
      },
    );

    io.to(receiverId).emit("requestReply", { accept });
    io.to(senderId).emit("friends", {
      requestState: relation,
    });
  });

  // Storing sms for offline user
  socket.on("offline_User sms", async (data) => {
    const {
      senderId,
      userName,
      receiverId,
      receiverFullName,
      identifier,
      sms,
      fileName,
      fileType,
      fileData,
    } = data;

    io.to(senderId).emit("last message", { senderId: receiverId, sms });
    try {
      const existingNotification = await Notification.findOne({
        "sender.id": senderId,
        "receiver.id": receiverId,
      });

      const newMessage = {
        identifier,
        text: sms,
        file: fileName ? { fileName, fileType, fileData } : undefined,
        sender_delete: false,
        timestamp: Date.now(),
      };

      if (existingNotification) {
        await Notification.updateOne(
          { "sender.id": senderId, "receiver.id": receiverId },
          { $push: { messages: newMessage } },
        );
      } else {
        await Notification.create({
          sender: { id: senderId, name: userName },
          receiver: { id: receiverId, name: receiverFullName },
          identifier,
          messages: [newMessage],
        });
      }
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  });

  // Video call backend system
  socket.on("video-call", (receiverId) => {
    socket.to(receiverId).emit("joined");
  });

  socket.on("ice-candidate", (candidate, receiverId) => {
    socket.to(receiverId).emit("ice-candidate", candidate);
  });

  socket.on("offer", (offer, receiverId) => {
    socket.to(receiverId).emit("offer", offer);
  });

  socket.on("answer", (answer, receiverId) => {
    socket.to(receiverId).emit("answer", answer);
  });

  // Delete sms for everyone
  socket.on("delete-everyone", async (data) => {
    const { senderId, receiverId, identifier } = data;
    try {
      const chat = await Message.findOne({
        "users.id": { $all: [senderId, receiverId] },
      });

      if (!chat) {
        console.log("No chat found!");
        return;
      }

      const messageIndex = chat.messages.findIndex(
        (msg) => msg.identifier === identifier,
      );

      if (messageIndex === -1) {
        console.log("Message not found!");
        return;
      }

      chat.messages.splice(messageIndex, 1);

      await chat.save();
    } catch (error) {
      console.log(error);
    }
    io.to(receiverId).emit("delete", identifier);
  });

  // Delete only one user's sms
  socket.on("delete-me", async (data) => {
    const { senderId, receiverId, identifier, sender } = data;
    try {
      const chat = await Message.findOne({
        "users.id": { $all: [senderId, receiverId] },
      });
      if (!chat) {
        return;
      }
      const message = chat.messages.find(
        (msg) => msg.identifier === identifier,
      );
      if (!message) {
        return;
      }
      if (sender === "You") {
        message.sender_delete = true;
      } else {
        message.reciever_delete = true;
      }
      if (message.sender_delete && message.reciever_delete) {
        chat.messages = chat.messages.filter(
          (msg) => msg.identifier !== identifier,
        );
      }
      await chat.save();
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("groupClick", async (data) => {
    const { groupMembers, groupId } = data;
    socket.join(groupId);
    const onlineMember = groupMembers.map((member) => {
      if (users[member.id]) {
        return member;
      }
    });

    const groupMessages =
      await GroupMessage.findById(groupId).select("messages");
    io.to(groupId).emit("onlineMember", onlineMember);
    for (const member of onlineMember) {
      io.to(member.id).emit("updateState", { senderId: member.id });
    }
    groupMessages.map((message) => {
      io.to(groupId).emit("groupStoredMessages", {
        senderId: message.sender.id,
        name: message.sender.name,
        avatar: message.sender.avatar,
        identifier: message.sender.identifier,
        text: message.text,
        file: message.file,
      });
    });
  });

  socket.on("send groupMessage", async () => {
    const {
      groupId,
      senderId,
      userName,
      senderAvatar,
      receiverId,
      receiverFullName,
      receiverAvatar,
      identifier,
      sms,
      fileName,
      fileType,
      fileData,
    } = data;
    if (fileData) {
      const filePath = path.join(__dirname, "uploads", fileName);
      fs.writeFileSync(filePath, Buffer.from(fileData));
    }
    io.to(receiverId).emit("receive groupMessage", {
      senderId,
      identifier,
      fileName,
      fileType,
      fileData,
      sms,
    });
    let existingChat = await GroupMessage.findById(groupId);
    if (existingChat) {
      existingChat.messages.push({
        sender: { id: senderId },
        identifier: identifier,
        text: sms,
        sender_delete: false,
        reciever_delete: [],
        file: {
          fileName,
          fileType,
          fileData,
        },
        timestamp: Date.now(),
      });
      await existingChat.save();
    }
  });

  socket.on("postViewers", async (userId) => {
    socket.join(userId);
    postViewers[userId];
  });

  socket.on("getComments", async (postId) => {
    try {
      const comments = await PostComment.find({
        postId,
        parentCommentId: null
      })
        .populate("userId", "fullName avatar")
        .sort({ createdAt: -1 })
        .lean();

      for (const comment of comments) {
        const replies = await PostComment.find({
          parentCommentId: comment._id
        })
          .populate("userId", "fullName avatar")
          .sort({ createdAt: 1 })
          .lean();

        comment.replies = replies;
      }
      console.log("COmments", comments);

      socket.emit("ReceiveComments", {
        success: true,
        comments
      });
    } catch (err) {
      socket.emit("ReceiveComments", {
        success: false,
        message: err.message
      });
    }
  });

  socket.on("WriteComment", async (data) => {
    const { userId, postId, commentText } = data;
    console.log("Commentdata", userId, postId, commentText)

    // Post exists 
    const post = await Post.findById(postId);

    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    const newComment = await PostComment.create({
      postId,
      userId,
      comment: commentText,
    });

    // Post
    await Post.findByIdAndUpdate(
      postId,
      {
        $inc: {
          "post.commentsCount": 1
        }
      }
    );
  })

  // socket.on("GetComments", async (postId) => {
  //   try {
  //     const comments = await PostComment.find({
  //       postId,
  //       parentCommentId: null
  //     })
  //       .populate("userId", "fullName avatar")
  //       .sort({ createdAt: -1 });

  //     for (const comment of comments) {
  //       const replies = await PostComment.find({
  //         parentCommentId: comment._id
  //       })
  //         .populate("userId", "fullName avatar")
  //         .sort({ createdAt: 1 });
  //       comment._doc.replies = replies;
  //     }
  //     socket.emit("ReceiveComments", comments);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // });

  // Disconnection system

  socket.on("disconnect", () => {
    const entry = Object.entries(users).find(
      ([_, user]) => user.socketId === socket.id,
    );

    if (!entry) return;

    const [senderId, user] = entry;

    if (user.viewers?.length) {
      user.viewers.forEach((viewerId) => {
        const viewer = users[viewerId];
        if (!viewer) return;

        if (viewer.selectedUser === senderId) {
          io.to(viewer.socketId).emit("checkDisconnect", "offline");
        }

        viewer.viewers = viewer.viewers?.filter((id) => id !== senderId);
      });
    }

    delete users[senderId];
    console.log("usersDE", users);
  });
});

export { server };
