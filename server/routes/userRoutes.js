const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getProfile, updateProfile, followUser } = require('../controllers/userController');

router.get('/:id', getProfile);
router.put('/me', auth, updateProfile);
router.put('/:id/follow', auth, followUser);

module.exports = router;
