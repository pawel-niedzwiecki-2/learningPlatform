// import all plugin and modules
const createError = require('http-errors')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const passport = require('passport')
const mongoose = require('mongoose')
const configDB = require('./config/db.config')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

// import auth strategy
const strategyLocal = require('./middleware/auth/strategy/local')
const strategyJWT = require('./middleware/auth/strategy/jwt')

// main route
const indexRouter = require('./routes/index')

// doc route
const selectDocRouter = require('./routes/documentation/select.doc.routes')

// doc v1 rote
const authDocV1Router = require('./routes/documentation/v1/auth/auth.doc.routes')
const startDocV1Router = require('./routes/documentation/v1/start/start.doc.routes')
const filesDocV1Router = require('./routes/documentation/v1/files/files.doc.routes')
const pagesDocV1Router = require('./routes/documentation/v1/pages/pages.doc.routes')
const usersDocV1Router = require('./routes/documentation/v1/users/users.doc.routes')
const lecturesDocV1Router = require('./routes/documentation/v1/lectures/lectures.doc.routes')

// api route
const filesAPIRouter = require('./routes/api/files/files.routes')
const lecturesAPIRouter = require('./routes/api/lectures/lectures.routes')
const pagesAPIRouter = require('./routes/api/pages/pages.routes')
const usersAPIRouter = require('./routes/api/users/users.routes')
const authAPIRouter = require('./routes/api/auth/auth.routes')

const app = express()

//Set up default mongoose connection
const mongoDB = `mongodb+srv://${configDB.username}:${configDB.password}@${configDB.host}/${configDB.db}?retryWrites=true&w=majority`
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })

//Get the default connection
const db = mongoose.connection

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// use middleware
strategyJWT
strategyLocal
app.use(logger('dev'))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// main
 app.use('/', indexRouter)

// doc select
app.use('/doc', selectDocRouter)

// doc v1
app.use('/doc', startDocV1Router)
app.use('/doc/auth', authDocV1Router)
app.use('/doc/files', filesDocV1Router)
app.use('/doc/pages', pagesDocV1Router)
app.use('/doc/users', usersDocV1Router)
app.use('/doc/lectures', lecturesDocV1Router)

// api
app.use('/api/v1/auth', authAPIRouter)
app.use('/api/v1/files', filesAPIRouter)
app.use('/api/v1/pages', pagesAPIRouter)
app.use('/api/v1/lectures', lecturesAPIRouter)
app.use('/api/v1/users', passport.authenticate('jwt', { session: false }), usersAPIRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
