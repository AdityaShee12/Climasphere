import { asyncHandler } from "../../utils/handlers/asyncHandler.js";
import { Message } from "../../models/chat/Message.models.js";

const getUserConversations = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }
        const chatRooms = await Message.find({
            "users.id": userId,
            "messages.0": { $exists: true },
        }).sort({ "messages.timestamp": -1 });
        let userData = [];
        if (chatRooms.length > 0) {
            chatRooms.forEach((chat) => {
                chat.users.forEach((user) => {
                    if (user.id.toString() !== userId) {
                        const lastMessage = chat.messages[chat.messages.length - 1];
                        let chatter;
                        if (user.id === lastMessage.sender.id) {
                            chatter = "reciever";
                        } else {
                            chatter = "sender";
                        }
                        console.log("user",user);
                        
                        userData.push({
                            _id: user.id,
                            fullName: user.name,
                            avatar: user.avatar || "",
                            lastMessage: {
                                text: lastMessage?.text || null,
                                file: lastMessage?.file || null,
                                chatter,
                                timestamp: lastMessage?.timestamp || null,
                            },
                        });
                    }
                });
            });
        }
        res.json(userData);
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({ error: "Server error" });
    }
});

export {
    getUserConversations
};