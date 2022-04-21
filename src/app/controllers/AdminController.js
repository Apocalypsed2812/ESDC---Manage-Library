const Account = require('../models/Account');
const Staff = require('../models/Staff');
//const Post = require('../models/Post');
const bcrypt = require("bcrypt");
const Book = require('../models/Book');
const Comment = require('../models/Comment');
const {multipleMongooseToObject, mongooseToOject} = require('../../util/mongoose')
//const uploadImage = require("../lib/uploadImage");
//const setFlashMessage = require('../lib/setFlashMessage')

class AdminController {

    // [GET] /admin/home
    renderHome(req, res, next) {
        const account = req.account;
        //const first_10_posts = await Post.find({}).sort({ date: -1 }).limit(10).lean();
        res.render('./admin/home');
    }  

    // [GET] /admin/book
    async renderBook(req, res){
        let PAGE_SKIP = 8
        let page = req.query.page || 0
        console.log(page)
        let skip = PAGE_SKIP * page
        let count = await Book.count({});
        let books = await Book
                .find({})
                .skip(skip)
                .limit(PAGE_SKIP)
                .lean()
        // console.log(books)
        res.render('./admin/book', {data: books, count, page}) 
    }

    // [GET] admin/book/:slug
    bookDetail(req, res, next){
        Book.findOne({slug: req.params.slug})
            .then(book => {
                res.render('./admin/book_detail', {book: mongooseToOject(book)})
            })
            .catch(next);
    }

    // [GET] /admin/staff
    // renderStaff(req, res, next) {
    //     //const account = req.account;
    //     Staff.find({}, (err, data) => {
    //         if(err){
    //             console.log(err)
    //             res.status(400).json({error: 'Có lỗi khi đọc dữ liệu'})
    //         }
    //         else{
    //             console.log('Đọc dữ liệu thành công')
    //             //data = data.map(data => data.toObject())
    //             res.render('./admin/staff', {staff: multipleMongooseToObject(data)})
    //         }
    //     })  
    //     //const first_10_posts = await Post.find({}).sort({ date: -1 }).limit(10).lean();
    //     //res.render('./admin/staff');
    // } 
    async renderStaff(req, res, next) {
        let staff = await Staff.find({}).lean()
        //console.log(staff)
        res.render('./admin/staff', {staff})
    } 
    
    // [GET] /admin/staff
    renderMember(req, res, next) {
        const account = req.account;
        let role = account.role
        //const first_10_posts = await Post.find({}).sort({ date: -1 }).limit(10).lean();
        Account.find({role: "user"}, (err, data) => {
            if(err){
                console.log(err)
                res.status(400).json({error: 'Có lỗi khi đọc dữ liệu'})
            }
            else{
                console.log('Đọc dữ liệu thành công')
                //data = data.map(data => data.toObject())
                res.render('./admin/member', {data: multipleMongooseToObject(data)})
            }
        })  
    } 

      // [GET] /admin/comment
      async renderComment(req, res, next) {
        const account = req.account;
        let comment = await Comment.find({}).lean()
        res.render('./admin/comment', {comment});
    } 

    // [POST] /admin/addstaff
    addStaff(req, res){
        let {username, name, identity, sex, phone, date, email, address} = req.body;
        let data = {
            email,
            name,
            username,
            password: "123456789",
            phone,
            date, 
            address, 
            sex,
            identity,
        };
        console.log(email)
        console.log(name)
        console.log(username)
        //console.log(password)
        console.log(phone)
        console.log(date)
        console.log(address)
        console.log(sex)
        console.log(identity)
        const staff = new Staff(data);
        staff.save();
        //req.session.user_id = account._id;
        res.redirect("/admin/staff");
    }

    // [POST] /admin/search
    async searchBook(req, res){
        let search = req.body
        //console.log(search)
        let books = await Book
                .findOne({name: search.book})
                .lean()
        console.log(books)
        res.render('./admin/search_book', {search: books}) 
    }

    // [POST] /admin/updateStaff
    updateStaff(req, res){
        let {id, name, username, identity, phone, address, sex, date, email} = req.body
        if(!id){
            return res.json({code: 1, message: "Thiếu tham số id"})
        }
        Staff.findByIdAndUpdate(id, {name, username, identity, phone, address, sex, date, email}, {
            new: true
        })
        .then(p => {
            if(p){
                return res.json({code: 0, message: "Cập nhật nhân viên thành công"})
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy nhân viên để cập nhật"})
            }  
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
        })
    }

    // [POST] /admin/updateMember
    updateMember(req, res){
        let {id, name, username, phone, email} = req.body
        if(!id){
            return res.json({code: 1, message: "Thiếu tham số id"})
        }
        Account.findByIdAndUpdate(id, {name, username, phone, email}, {
            new: true
        })
        .then(p => {
            if(p){
                return res.json({code: 0, message: "Cập nhật người dùng thành công"})
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy người dùng để cập nhật"})
            }  
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
        })
    }

    // [DELETE] /admin/deleteComment
    deleteComment(req, res){
        let {id} = req.params
        console.log(id)
        if(!id){
            return res.json({code: 1, message: "Thiếu tham số id"})
        }
        Comment.findByIdAndDelete(id)
        .then(p => {
            if(p){
                return res.json({code: 0, message: "Xóa comment thành công"})
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy comment để xóa"})
            }
        
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
        })
    }

    
}

module.exports = new AdminController;