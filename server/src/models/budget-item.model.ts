import mongoose, { Document, Schema } from 'mongoose';

export interface IBudgetItem extends Document {
  name: string;
  category: string;
  amount: number;
  status: 'planned' | 'approved' | 'spent';
  event: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const budgetItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['planned', 'approved', 'spent'],
      default: 'planned',
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBudgetItem>('BudgetItem', budgetItemSchema);
