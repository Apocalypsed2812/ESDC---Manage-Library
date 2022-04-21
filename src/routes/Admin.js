const express = require('express');
const router = express.Router()
const AdminController = require('../app/controllers/AdminController');
const checkAdmin = require("../app/middleware/checkAdmin");
//const flash = require("../app/middleware/flashMessage");

router.use(checkAdmin);
router.get('/home', AdminController.renderHome)
router.get('/book', AdminController.renderBook)
router.get('/book/:slug', AdminController.bookDetail);
router.get('/staff', AdminController.renderStaff);
router.get('/member', AdminController.renderMember);
router.get('/comment', AdminController.renderComment);
router.post('/addstaff', AdminController.addStaff);
router.post('/search', AdminController.searchBook);
router.post('/updateStaff', AdminController.updateStaff);
router.post('/updateMember', AdminController.updateMember);
router.delete('/deleteComment/:id', AdminController.deleteComment);

module.exports = router;