import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'organizer' | 'attendee';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  role: {
    type: String,
    enum: ['organizer', 'attendee'],
    default: 'attendee',
  },
}, {
  timestamps: true,
});

// Prevent model recompilation
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

