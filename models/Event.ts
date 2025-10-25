import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  organizer: mongoose.Types.ObjectId;
  organizerName?: string;
  organizerEmail?: string;
  attendees: mongoose.Types.ObjectId[];
  capacity?: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema<IEvent> = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide an event title'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide an event description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters'],
  },
  date: {
    type: Date,
    required: [true, 'Please provide an event date'],
  },
  time: {
    type: String,
    required: [true, 'Please provide an event time'],
  },
  location: {
    type: String,
    required: [true, 'Please provide an event location'],
    maxlength: [200, 'Location cannot be more than 200 characters'],
  },
  organizer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  attendees: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  capacity: {
    type: Number,
    min: [1, 'Capacity must be at least 1'],
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Virtual field for organizer info
EventSchema.virtual('organizerInfo', {
  ref: 'User',
  localField: 'organizer',
  foreignField: '_id',
  justOne: true,
});

// Enable virtual fields in JSON
EventSchema.set('toJSON', { virtuals: true });
EventSchema.set('toObject', { virtuals: true });

const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;

