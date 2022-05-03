
const helpers = {
    pagination_book_user: (count, page) => {
        let body = `<li class="page-item"><a class="page-link" href="/user/book?page=${page == 0 ? 0 : page - 1}">Previous</a></li>`
        let number_page = (count % 8 === 0) ?  Math.floor(count / 8) : Math.floor(count / 8) + 1
        for(let i = 0; i < number_page; i ++){
            body += `<li class="page-item"><a class="page-link" href="/user/book?page=${i}">${i}</a></li>`
        }
        body += `<li class="page-item"><a class="page-link" href="/user/book?page=${page == number_page ? number_page : page + 1}">Next</a></li>`
        return body
    },

    pagination_book_staff: (count, page) => {
        let body = `<li class="page-item"><a class="page-link" href="/staff/book?page=${page == 0 ? 0 : page - 1}">Previous</a></li>`
        let number_page = (count % 8 === 0) ?  Math.floor(count / 8) : Math.floor(count / 8) + 1
        for(let i = 0; i < number_page; i ++){
            body += `<li class="page-item"><a class="page-link" href="/staff/book?page=${i}">${i}</a></li>`
        }
        body += `<li class="page-item"><a class="page-link" href="/staff/book?page=${page == number_page ? number_page : page + 1}">Next</a></li>`
        return body
    },

    pagination_book_admin: (count, page) => {
        let body = `<li class="page-item"><a class="page-link" href="/admin/book?page=${page == 0 ? 0 : page - 1}">Previous</a></li>`
        let number_page = (count % 8 === 0) ?  Math.floor(count / 8) : Math.floor(count / 8) + 1
        for(let i = 0; i < number_page; i ++){
            body += `<li class="page-item"><a class="page-link" href="/admin/book?page=${i}">${i}</a></li>`
        }
        body += `<li class="page-item"><a class="page-link" href="/admin/book?page=${page == number_page ? number_page : page + 1}">Next</a></li>`
        return body
    },

    pagination_comment_user: (count, page) => {
        let body = `<li class="page-item"><a class="page-link" href="/user/comment?page=${page == 0 ? 0 : page - 1}">Previous</a></li>`
        let number_page = (count % 10 === 0) ?  Math.floor(count / 10) : Math.floor(count / 10) + 1
        for(let i = 0; i < number_page; i ++){
            body += `<li class="page-item"><a class="page-link" href="/user/comment?page=${i}">${i}</a></li>`
        }
        body += `<li class="page-item"><a class="page-link" href="/user/comment?page=${page == number_page ? number_page : page++}">Next</a></li>`
        return body
    },

    pagination_loan_staff: (count, page) => {
        let body = `<li class="page-item"><a class="page-link" href="/staff/loan?page=${page == 0 ? 0 : page -1 }">Previous</a></li>`
        let number_page = (count % 4 === 0) ?  Math.floor(count / 4) : Math.floor(count / 4) + 1
        for(let i = 0; i < number_page; i ++){
            body += `<li class="page-item"><a class="page-link" href="/staff/loan?page=${i}">${i}</a></li>`
        }
        body += `<li class="page-item"><a class="page-link" href="/staff/loan?page=${page == number_page ? number_page : page++}">Next</a></li>`
        return body
    },

    checkArrayNull: (array) => {
        if(array[0] === 'null'){
            return false
        }
        return true
    },

    displayDownload: (category, file) => {
        let down = ``
        if(category === 'download'){
            down += `<a href="/file/${file}" class="btn btn-outline-primary">Tải về tài liệu</a>`
        }
        else{
            down += `<p class="mt-3 text-danger">Bạn không có quyền tải xuống tài liệu này</p>`
        }
        return down   
    },

    checkToast: () => {
        return 1
    },

    checkToastFailure: () => {
        return 0
    }
}
module.exports = helpers