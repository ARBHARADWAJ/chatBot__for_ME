import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        enum: ['user', 'bot'],
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    chatSessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatSession', // Links this message to a specific conversation
        required: true,
    },
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
export default Message;