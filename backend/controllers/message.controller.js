import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params.id;
    const senderId = req.user._Id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    //SOCKET io will go here

    // await conversation.save() this will run first
    // await newMessage.save() this will run second

    //By using a promise, we make it run at the same time (in parallel)
    await Promise.all([conversation.save(), newMessage.save()]);
    res.status(201).json({ newMessage });
  } catch (error) {
    console.log("Error at sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages"); //NOT REFERENCE BUT ACTUAL MESSAGE

    if (!conversation) return res.status(200).jon([]);

    const messages = conversation.messages;
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controler: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};