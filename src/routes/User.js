const express = require('express');
const router = express.Router()
const UserController = require('../app/controllers/UserController');
const checkUser = require("../app/middleware/checkUser");
//const flash = require("../app/middleware/flashMessage");

router.use(checkUser);
router.get('/home', UserController.renderHome);
router.get('/book', UserController.renderBook);
router.get('/book/:slug', UserController.bookDetail);
router.get('/comment', UserController.renderComment);
router.post('/addComment', UserController.addComment)
router.post('/search', UserController.searchBook);

module.exports = router;