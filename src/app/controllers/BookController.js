const Book = require('../models/Book');
const {multipleMongooseToObject, mongooseToOject} = require('../../util/mongoose')
class BookController{

    // [GET] /book
    index(req, res){
        Book.find({}, (err, data) => {
            if(err){
                console.log(err)
                res.status(400).json({error: 'Có lỗi khi đọc dữ liệu'})
            }
            else{
                console.log('Đọc dữ liệu thành công')
                //data = data.map(data => data.toObject())
                res.render('./admin/book', {data: multipleMongooseToObject(data)})
            }
        })  
    }

    // [GET] /book/:slug
    show(req, res, next){
        Book.findOne({slug: req.params.slug})
            .then(book => {
                res.render('book_detail', {book: mongooseToOject(book)})
            })
            .catch(next);
    }
}

module.exports = new BookController;