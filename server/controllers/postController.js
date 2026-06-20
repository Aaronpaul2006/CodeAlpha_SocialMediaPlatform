const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');

exports.createPost = async (req, res) => {
  try {
    const { text, image } = req.body;
    if (!text) return res.status(400).json({ message: 'Post text is required' });

    const post = await Post.create({ author: req.userId, text, image });
    const populated = await post.populate('author', 'name avatar');

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Feed: posts from users the logged-in user follows, plus their own posts
exports.getFeed = async (req, res) => {
  try {
    const me = await User.findById(req.userId);
    const authorIds = [...me.following, me._id];

    const posts = await Post.find({ author: { $in: authorIds } })
      .sort({ createdAt: -1 })
      .populate('author', 'name avatar');

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name avatar');
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comments = await Comment.find({ post: post._id })
      .sort({ createdAt: 1 })
      .populate('author', 'name avatar');

    res.json({ post, comments });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const liked = post.likes.includes(req.userId);

    if (liked) {
      post.likes.pull(req.userId);
    } else {
      post.likes.push(req.userId);
    }

    await post.save();
    res.json({ likesCount: post.likes.length, liked: !liked });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await post.deleteOne();
    await Comment.deleteMany({ post: post._id });

    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
