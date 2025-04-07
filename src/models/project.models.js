
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    default: '',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  joinCode: {
    type: String,
    unique: true,
    required: true,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],

  tags: [{
    type: String,
    trim: true,
  }],
  playground : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collab',
  }
},{ timestamps: true });

const Project = mongoose.model('Project', projectSchema);

export default Project;
