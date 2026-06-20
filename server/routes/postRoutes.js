const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createPost,
  getFeed,
  getPost,
  toggleLike,
  deletePost,
} = require('../controllers/postController');

router.post('/', auth, createPost);
router.get('/feed', auth, getFeed);
router.get('/:id', getPost);
router.put('/:id/like', auth, toggleLike);
router.delete('/:id', auth, deletePost);

module.exports = router;
