class SiteController{

    // [GET] /
    index(req, res){
        res.render('index');
    }

    // [GET] /staff
    staff(req, res){
        res.render('staff')
    }

    register(req, res){
        res.render('register')
    }

    login(req, res){
        res.render('login')
    }
}

module.exports = new SiteController;