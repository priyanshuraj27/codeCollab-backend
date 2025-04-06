
import mongoose from 'mongoose';

const contributorSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  role: {
    type: String,
    enum: ['owner', 'contributor'],
    default: 'contributor',
  },

  joinedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true
});

// Prevent duplicate user-project pairs
contributorSchema.index({ project: 1, user: 1 }, { unique: true });

const Contributor = mongoose.model('Contributor', contributorSchema);

export default Contributor;
