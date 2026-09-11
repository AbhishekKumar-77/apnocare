import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Elderly Care', 'Nursing Support', 'Physiotherapy', 'Post-Op Recovery', 'Diagnostic Assistance'],
      default: 'Elderly Care',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    icon: {
      type: String,
      default: 'HeartPulse',
    },
    pricePerDay: {
      type: Number,
      required: false,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    features: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model('Service', serviceSchema);
export default Service;
