import mongoose from 'mongoose';

const crosswalkSchema = new mongoose.Schema({
  location: {
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    street: {
      type: String,
      required: [true, 'Street is required'],
      trim: true
    },
    number: {
      type: String,
      required: [true, 'Street number is required'],
      trim: true
    }
  },

  cameraId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Camera',
    required: [true, 'Camera ID is required']
  },

  ledId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LED',
    required: [true, 'LED ID is required']
  }

}, {
  timestamps: true
});

const Crosswalk = mongoose.model('Crosswalk', crosswalkSchema);

export default Crosswalk;
