import mongoose, { Document, Schema } from 'mongoose';

export interface IEditHistory extends Document {
  userId: mongoose.Types.ObjectId;
  originalImageUrl: string; // base64 or URL
  editedImageUrl: string; // base64 or URL
  instruction: string;
  timestamp: Date;
  metadata?: {
    modelUsed?: string;
    processingTime?: number;
  };
}

const editHistorySchema = new Schema<IEditHistory>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  originalImageUrl: {
    type: String,
    required: true
  },
  editedImageUrl: {
    type: String,
    required: true
  },
  instruction: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  metadata: {
    modelUsed: String,
    processingTime: Number
  }
});

// Index for faster queries by user and timestamp
editHistorySchema.index({ userId: 1, timestamp: -1 });

export const EditHistory = mongoose.model<IEditHistory>('EditHistory', editHistorySchema);
