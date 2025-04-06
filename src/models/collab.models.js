
import mongoose from 'mongoose';

const collabSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },

  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  content:{
    type: String,
  },
  logs: [{
    timestamp: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    action: {
      type: String,
    },
    content: {
      type: String,
    }
  }]
}, {
  timestamps: true
});

const Collab = mongoose.model('Collab', collabSchema);

export default Collab;
