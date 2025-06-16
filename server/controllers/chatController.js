import Chat from '../models/Chat.js';

// Get chat history between user and doctor
export const getChatHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const doctorId = req.params.doctorId;

    const messages = await Chat.find({
      $or: [
        { sender: userId, receiver: doctorId },
        { sender: doctorId, receiver: userId }
      ]
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user.userId;

    const newMessage = new Chat({
      sender: senderId,
      receiver: receiverId,
      message
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
