const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const morgan = require('morgan');
const exphbs = require('express-handlebars'); 
const path = require('path')
const passport = require('passport')
const session = require('express-session');
const User = require('./models/User');
const MongoStore = require('connect-mongo')
const ejsMate = require('ejs-mate')
const {formatDate, truncate, stripTags, select} = require('./helper/ejs')
const methodOverride = require('method-override');
const Story = require('./models/Story');


// Load config
dotenv.config({ path: './config/config.env' });
connectDB();

//passport config
require('./config/passport')(passport)

const app = express();

if (process.env.NODE_ENV == 'production') {
    app.use(morgan('dev'));
}

// Helper 
app.use((req, res, next) =>{
    res.locals.currentUser = req.user;
    res.locals.formatDate = formatDate;
    res.locals.truncate = truncate;
    res.locals.stripTags = stripTags;
    res.locals.select = select;
    next()
})


// Static Folader
app.use(express.static(path.join(__dirname, 'public')))

//express-handlebars
// app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs' }));
// app.set('view engine', '.hbs');

app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')
app.engine('ejs', ejsMate)


// Express sessions 
app.use(session({
    secret : 'thisismysecret',
    resave : false,
    saveUninitialized : false,
    store : MongoStore.create({ 
        mongoUrl: process.env.MONGO_URI, 
        mongooseConnection: mongoose.connection
    })
}))

// passport middileware
app.use(passport.initialize())
app.use(passport.session())

// body parser middle ware
// app.use(bodyParser.urlencoded({extended:false}))
app.use(express.urlencoded({extended:false}))
app.use(express.json())

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

// Method overrride 
app.use(methodOverride('_method'))


app.put('/:id', async(req, res) => {
    const {id} = req.params;
    await Story.findByIdAndUpdate(id, {...req.body});
    res.redirect('stories')
})

app.delete('/:id', async(req, res) => {
    try{
        await Story.findByIdAndDelete(req.params.id)
        res.redirect('dashboard');
    }catch(err){
        console.error(err)
        res.render('error/400')
    }
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
