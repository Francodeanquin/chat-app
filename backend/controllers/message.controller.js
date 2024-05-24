import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// Controlador para enviar un mensaje
export const sendMessage = async (req, res) => {
	try {
		const { message } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		// Buscar la conversación existente o crear una nueva si no existe
		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		// Crear un nuevo mensaje
		const newMessage = new Message({
			senderId,
			receiverId,
			message,
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

		// Guardar la conversación y el nuevo mensaje en paralelo
		await Promise.all([conversation.save(), newMessage.save()]);

		// Obtener el ID del socket del receptor y emitir el evento de nuevo mensaje
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

		// Responder con el nuevo mensaje creado
		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error en el controlador sendMessage: ", error.message);
		res.status(500).json({ error: "Error interno del servidor" });
	}
};

// Controlador para obtener los mensajes de una conversación
export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		// Buscar la conversación que incluye a ambos participantes
		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); // Poblamos los mensajes para obtener los detalles completos

		if (!conversation) return res.status(200).json([]);

		// Obtener los mensajes de la conversación
		const messages = conversation.messages;

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error en el controlador getMessages: ", error.message);
		res.status(500).json({ error: "Error interno del servidor" });
	}
};
