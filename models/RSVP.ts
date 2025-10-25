import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IRSVP extends Document {
  event: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  status: 'attending' | 'not_attending' | 'maybe';
  createdAt: Date;
  updatedAt: Date;
}

const RSVPSchema: Schema<IRSVP> = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['attending', 'not_attending', 'maybe'],
    default: 'attending',
  },
}, {
  timestamps: true,
});

// Compound index to ensure one RSVP per user per event
RSVPSchema.index({ event: 1, user: 1 }, { unique: true });

const RSVP: Model<IRSVP> = mongoose.models.RSVP || mongoose.model<IRSVP>('RSVP', RSVPSchema);

export default RSVP;

