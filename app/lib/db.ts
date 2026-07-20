import mongoose from "mongoose";

const MongoDB_URI = process.env.MONGO_URL ?? "";

if (!MongoDB_URI) {
  throw new Error(
    "Please define the MONGO_URL environment variable inside .env",
  );
}

type MongooseCache = {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};
global.mongooseCache = cached;

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
    };
    cached.promise = mongoose
      .connect(MongoDB_URI, opts)
      .then(() => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
