const Account = require('../models/Account');
const Comment = require('../models/Comment');
//const Post = require('../models/Post');
const bcrypt = require("bcrypt");
//const uploadImage = require("../lib/uploadImage");
//const setFlashMessage = require('../lib/setFlashMessage')
const Book = require('../models/Book');
const {multipleMongooseToObject, mongooseToOject} = require('../../util/mongoose')
const PAGE_SKIP = 8

class UserController {
  
    // [GET] /user/home
    renderHome(req, res, next) {
        //const account = req.account;
        //const first_10_posts = await Post.find({}).sort({ date: -1 }).limit(10).lean();
        res.render('./user/home');
    }  

    // [GET] /user/book
    // renderBook(req, res){
        
    //     Book.find({}, (err, data) => {
    //         if(err){
    //             console.log(err)
    //             res.status(400).json({error: 'Có lỗi khi đọc dữ liệu'})
    //         }
    //         else{
    //             console.log('Đọc dữ liệu thành công')
    //             //data = data.map(data => data.toObject())
    //             res.render('./user/book', {data: multipleMongooseToObject(data)})
    //         }
    //     })  
    // }
    async renderBook(req, res){
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
        res.render('./user/book', {data: books, count, page})
        // Book.find({}, (err, data) => {
        //     if(err){
        //         console.log(err)
        //         res.status(400).json({error: 'Có lỗi khi đọc dữ liệu'})
        //     }
        //     else{
        //         console.log('Đọc dữ liệu thành công')
        //         //data = data.map(data => data.toObject())
        //         res.render('./user/book', {data: multipleMongooseToObject(data)})
        //     }
        // })  
    }

    // [GET] /user/book/:slug
    bookDetail(req, res, next){
        Book.findOne({slug: req.params.slug})
            .then(book => {
                res.render('./user/book_detail', {book: mongooseToOject(book)})
            })
            .catch(next);
    }

    // [GET] /user/comment
    async renderComment(req, res){
        const account = req.account;
        let page = req.query.page || 0
        let skip_page = 10
        //console.log(page)
        let skip = skip_page * page
        let count = await Comment.count({});
        let comments = await Comment
                .find({})
                .skip(skip)
                .limit(skip_page)
                .lean()
        // console.log(books)
        res.render('./user/comment', {data: comments, count, page, account: account.username})
        // 

        // console.log(account.username)

        // let perPage = 4; // số lượng sản phẩm xuất hiện trên 1 page
        // let page = req.params.id || 1;

        // let start = (page - 1) * perPage;
        // let end = page * perPage;

        // let drop = (page -1) * perPage;

        // Comment.find({}, (err, data) => {
        //     if(err){
        //         console.log(err)
        //         res.status(400).json({error: 'Có lỗi khi đọc dữ liệu'})
        //     }
        //     else{
        //         console.log('Đọc dữ liệu thành công')
        //         //data = data.map(data => data.toObject())
        //         res.render('./user/comment', {data: multipleMongooseToObject(data).slice(start, end), account: account.username})
        //     }
        // })
    /*Comment
        .skip((perPage * page) - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
        .limit(perPage)
        .exec((err, data) => {
            Comment.countDocuments((err, count) => { // đếm để tính xem có bao nhiêu trang
                if (err) return next(err);
                res.render('./user/comment', {
                    data: multipleMongooseToObject(data), // bình luận trên một page
                    account: account.username, 
                    current: page, // page hiện tại
                    pages: Math.ceil(count / perPage) // tổng số các page
                });
            });
        }); */ 
    }

    // [POST] /user/addComment
    addComment(req, res){
        let {username, comment} = req.body;

        let cmt = new Comment({
            username,
            comment,
            avatar: '/images/avatar2.png',
        })
        cmt.save();
        return res.json({code: 0, message: "Thêm comment thành công"})
        //res.redirect('/user/comment');
    }

    // [POST] /user/search
    async searchBook(req, res){
        let search = req.body
        //console.log(search)
        let books = await Book
                .findOne({name: search.book})
                .lean()
        console.log(books)
        res.render('./user/search_book', {search: books}) 
    }
}

module.exports = new UserController;