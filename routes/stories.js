const express = require('express')
const router = express.Router() 
const Story = require('../models/Story')
const User = require('../models/User')
const {ensureAuth} = require('../middleware/auth')

// get request for stories route
router.get('/add', ensureAuth ,(req, res)=>{
    res.render('stories/add')
})

// to handle the form data 
router.post('/', ensureAuth ,async(req, res)=>{
    const newStory = {
        title : req.body.title,
        body : req.body.body,
        status : req.body.status,
        user : req.user.id
    }
    try{
        await Story.create(newStory).then(()=>{
            console.log("Data Saved in data base")
        }).catch(err => console.log(err))
        res.redirect('/dashboard')
    } catch(err){
        console.error(err)
        res.render('error/500')
    }
    
})

// Stories Route 
router.get('/',ensureAuth ,async(req, res)=>{
    const stories = await Story.find().populate('user').lean()
    let currentUser = req.user;
    res.render('stories/index', {currentUser,stories})
})

// Read more route
router.get('/:id',ensureAuth,async(req, res) => {
    try{
        const {id} = req.params
        const story = await Story.findById(id).populate('user').lean()
        res.render('stories/show', {story})
    }catch(err){
        console.error(err)
        res.render('error/500')
    }
})


// Edit the story 
router.get('/edit/:id', ensureAuth,async (req, res) => {
    const {id} = req.params;
    const story = await Story.findById(id)
    res.render('stories/edit', {id, story})
})

router.get('/user/:userId', async(req,res)=>{
    try{
        const stories = await Story.find({
            user :  req.params.userId,
            status : 'public'
        }).populate('user').lean()
        let currentUser = req.user;
        res.render('stories/index', {currentUser,stories})
    }catch (err){
        console.error(err);
        res.render('error/500')
    }
})



module.exports = router