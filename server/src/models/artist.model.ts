import mongoose, { Document, Schema } from 'mongoose';

export interface IArtist extends Document {
  name: string;
  contactEmail: string;
  contactPhone: string;
  genre: string;
  fee: number;
  contractStatus: 'pending' | 'signed' | 'completed' | 'cancelled';
  events: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const artistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    contactEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    genre: {
      type: String,
      trim: true,
    },
    fee: {
      type: Number,
      default: 0,
    },
    contractStatus: {
      type: String,
      enum: ['pending', 'signed', 'completed', 'cancelled'],
      default: 'pending',
    },
    events: [{
      type: Schema.Types.ObjectId,
      ref: 'Event',
    }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IArtist>('Artist', artistSchema);
