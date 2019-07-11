const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const handlebarHelpers = require('./handlebars-helpers.')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')

const recordList = require('./data/record.json').records
const userList = require('./data/user.json').users

const Record = require('./models/record.js')
const User = require('./models/user.js')


if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const hbs = exphbs.create({ helpers: {} })

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/record', { useNewUrlParser: true, useCreateIndex: true })
const db = mongoose.connection

db.on( 'error', () => {
    console.log('db connect fail')
})

db.once('open', () => {
    console.log('db connected!')

    userList.forEach((user, index) => {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) throw err

          User.create({
            name: user.name,
            email: user.email,
            password: hash,
            monthlyBudget: user.monthlyBudget
          })
          .then(user => {
            const records = index ? recordList.slice(6, 10) : recordList.slice(0, 5)

            records.forEach(record => {
              Record.create({
                name: record.name,
                category: record.category,
                amount: record.amount,
                date: record.date,
                userId: user._id
              })
            })
          })
        })
      })
    })

    console.log('done.')
  })

app.use(session({
    secret: 'foejfjowfif',
    resave: 'false',
    saveUninitialized: 'false'
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(flash())

  require('./config/passport')(passport)

  app.use((req, res, next) => {
    res.locals.user = req.user
    res.locals.isAuthenticated = req.isAuthenticated()
    res.locals.success_msg = req.flash('success_msg')
    res.locals.warning_msg = req.flash('warning_msg')
    res.locals.error_msg = req.flash('error_msg')

    next()
  })

const Record = require('./models/record.js')

app.use('/', require('./routes/index'))

app.listen(process.env.PORT || 3000, () => {
    console.log(`Express is listening on http://localhost:3000`)
})
