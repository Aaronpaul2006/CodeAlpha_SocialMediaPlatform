const User = require('../models/User');
const Post = require('../models/Post');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'name avatar')
      .populate('following', 'name avatar');

    if (!user) return res.status(404).json({ message: 'User not found' });

    const posts = await Post.find({ author: user._id }).sort({ createdAt: -1 });

    res.json({ user, posts });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { name, bio, avatar } },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.followUser = async (req, res) => {
  try {
    const targetId = req.params.id;

    if (targetId === req.userId) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ message: 'User not found' });

    const alreadyFollowing = target.followers.includes(req.userId);

    if (alreadyFollowing) {
      target.followers.pull(req.userId);
      await target.save();
      await User.findByIdAndUpdate(req.userId, { $pull: { following: targetId } });
      return res.json({ message: 'Unfollowed', following: false });
    } else {
      target.followers.push(req.userId);
      await target.save();
      await User.findByIdAndUpdate(req.userId, { $addToSet: { following: targetId } });
      return res.json({ message: 'Followed', following: true });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
