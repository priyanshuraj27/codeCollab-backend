import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  sentAt: {
    type: Date,
    default: Date.now,
  }
});

const chatMeetingSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },

  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],

  messages: [messageSchema]
}, {
  timestamps: true
});

const ChatMeeting = mongoose.model('ChatMeeting', chatMeetingSchema);

export default ChatMeeting;
