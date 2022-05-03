const accountRouter = require('./Account');
const adminRouter = require('./Admin');
const userRouter = require('./User');
const staffRouter = require('./Staff');

function route(app){

    //app.use('/book', bookRouter);

    app.use('/', accountRouter);

    app.use('/admin', adminRouter)

    app.use('/user', userRouter)

    app.use('/staff', staffRouter)
    
}

module.exports = route;