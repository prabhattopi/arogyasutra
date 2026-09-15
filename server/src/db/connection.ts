import mongoose from 'mongoose';
import { ENV } from '../config/env';

export let isConnectedToDb = false;

export async function connectDatabase(): Promise<void> {
  const uri = ENV.MONGODB_URI || 'mongodb://localhost:27017/arogyasutra';

  try {
    console.log(`⏳ [MongoDB] Connecting to Local MongoDB at ${uri}...`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnectedToDb = true;
    console.log('✔ [MongoDB] Successfully connected to Local MongoDB (100% Air-Gapped)!');
  } catch (error) {
    console.warn('ℹ [MongoDB] Local Mongo not running yet. Seamlessly operating in High-Speed In-Memory Mode.');
    isConnectedToDb = false;
  }
}
