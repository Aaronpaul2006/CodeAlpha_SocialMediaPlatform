const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createPost,
  getFeed,
  getPost,
  reactToPost,
  deletePost,
} = require('../controllers/postController');

router.post('/', auth, createPost);
router.get('/feed', auth, getFeed);
router.get('/:id', getPost);
router.put('/:id/react', auth, reactToPost);
router.delete('/:id', auth, deletePost);

module.exports = router;
