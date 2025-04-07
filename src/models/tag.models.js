
import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Tag = mongoose.model('Tag', tagSchema);

export default Tag;
