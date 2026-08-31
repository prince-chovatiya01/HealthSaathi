import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI is not defined in .env');
    console.error('   Set MONGODB_URI to a MongoDB Atlas connection string or a local MongoDB URI.');
    process.exit(1);
  }

  // Helpful diagnosis for common misconfigurations
  if (uri.includes('localhost') || uri.includes('127.0.0.1')) {
    console.warn('⚠️  Using local MongoDB. Make sure mongod is running on port 27017.');
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,  // 5s timeout instead of 30s default
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);

    if (error.message.includes('ECONNREFUSED')) {
      console.error('   → MongoDB is not reachable. If using local MongoDB, start mongod.');
      console.error('   → If using Atlas, check your MONGODB_URI in .env and whitelist your IP.');
    }

    if (error.message.includes('authentication failed')) {
      console.error('   → Wrong username or password in your Atlas connection string.');
    }

    if (error.message.includes('getaddrinfo')) {
      console.error('   → Cannot resolve host. Check your Atlas cluster hostname and internet connection.');
    }

    process.exit(1);
  }
};

// Handle disconnection events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

export default connectDB;
