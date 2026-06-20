require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

const PORT = process.env.PORT || 5000;

async function startServer() {
  let mongoUri = process.env.MONGO_URI;

  if (!mongoUri || mongoUri === 'mongodb://127.0.0.1:27017/social_app') {
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      console.log('Starting in-memory MongoDB server...');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log(`In-memory MongoDB started at: ${mongoUri}`);
    } catch (e) {
      console.error('Failed to start in-memory MongoDB server:', e.message);
      process.exit(1);
    }
  }

  mongoose
    .connect(mongoUri)
    .then(async () => {
      console.log('MongoDB connected');
      
      try {
        const Post = require('./models/Post');
        const postsWithLikes = await Post.find({ likes: { $exists: true } });
        if (postsWithLikes.length > 0) {
          console.log(`Found ${postsWithLikes.length} legacy posts to migrate from likes to reactions...`);
          for (const post of postsWithLikes) {
            const reactions = [];
            const oldLikes = post.get('likes');
            if (oldLikes && Array.isArray(oldLikes)) {
              oldLikes.forEach(userId => {
                reactions.push({
                  user: userId,
                  type: '❤️'
                });
              });
            }
            await Post.updateOne(
              { _id: post._id },
              { 
                $set: { reactions }, 
                $unset: { likes: "" } 
              }
            );
          }
          console.log('Data migration successfully completed.');
        }
      } catch (migrationErr) {
        console.error('Data migration failed:', migrationErr.message);
      }

      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
      process.exit(1);
    });
}

startServer();
