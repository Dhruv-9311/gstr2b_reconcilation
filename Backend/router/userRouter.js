const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { postUser, getUser, putUser, deleteUser, loginUser } = require('../controller/User');

router.post('/post', postUser);
router.get('/get', getUser);
router.get('/get/:id', getUser);
router.put('/put/:id', auth, putUser);
router.delete('/delete/:id', auth, deleteUser);
router.post('/login', loginUser);

module.exports = router;