import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  resetTokenHash: { type: String, select: false },
  resetTokenExpiry: { type: Date, select: false },
}, { timestamps: true });

export const User = model('User', userSchema);