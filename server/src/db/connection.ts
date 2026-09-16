import mongoose from 'mongoose';
import { ENV } from '../config/env';

export let isConnectedToDb = false;
let retryTimer: NodeJS.Timeout | null = null;

/**
 * Checks dynamic MongoDB connection state
 */
export function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

/**
 * Ensures connection is active before read/write, attempting auto-reconnect if needed
 */
export async function ensureDatabaseConnection(): Promise<boolean> {
  if (mongoose.connection.readyState === 1) {
    isConnectedToDb = true;
    return true;
  }

  const uri = ENV.MONGODB_URI || 'mongodb://localhost:27017/arogyasutra';
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    isConnectedToDb = true;
    console.log('✔ [MongoDB] Connected to Local MongoDB on port 27017!');
    return true;
  } catch {
    isConnectedToDb = false;
    return false;
  }
}

/**
 * Connects at startup with automatic background retry every 4s if Mongo starts later
 */
export async function connectDatabase(): Promise<void> {
  const uri = ENV.MONGODB_URI || 'mongodb://localhost:27017/arogyasutra';

  if (mongoose.connection.readyState === 1) {
    isConnectedToDb = true;
    return;
  }

  try {
    console.log(`⏳ [MongoDB] Connecting to Local MongoDB at ${uri}...`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    isConnectedToDb = true;
    console.log('✔ [MongoDB] Successfully connected to Local MongoDB (100% Air-Gapped)!');

    if (retryTimer) {
      clearInterval(retryTimer);
      retryTimer = null;
    }
  } catch (error) {
    console.warn('ℹ [MongoDB] Local Mongo not ready yet. Operating in In-Memory Mode and will auto-reconnect when Mongo starts.');
    isConnectedToDb = false;

    // Start background auto-reconnect polling if not already started
    if (!retryTimer) {
      retryTimer = setInterval(async () => {
        if (mongoose.connection.readyState !== 1) {
          try {
            await mongoose.connect(uri, { serverSelectionTimeoutMS: 2500 });
            isConnectedToDb = true;
            console.log('✔ [MongoDB] Auto-reconnected to Local MongoDB successfully!');
            if (retryTimer) {
              clearInterval(retryTimer);
              retryTimer = null;
            }
          } catch {
            // Still waiting for Mongo container
          }
        } else {
          isConnectedToDb = true;
          if (retryTimer) {
            clearInterval(retryTimer);
            retryTimer = null;
          }
        }
      }, 4000);
    }
  }
}

mongoose.connection.on('connected', () => {
  isConnectedToDb = true;
});

mongoose.connection.on('disconnected', () => {
  isConnectedToDb = false;
});
