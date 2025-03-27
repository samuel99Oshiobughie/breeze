// models/User.ts
import mongoose, { Schema, model, Model, Document } from 'mongoose';

// Define the interface for the User document
interface IUser extends Document {
  name: string;
  email: string;
  createdAt: Date;
}

// Define the schema
const userSchema: Schema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create or get the model
const User: Model<IUser> = mongoose.models.User || model<IUser>('User', userSchema);

export default User;