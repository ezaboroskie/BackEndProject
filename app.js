// APP SETUP
const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const models = require('./models')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const session = require('express-session')
const { Op } = require('sequelize') // Operator 
const formidable = require('formidable')
const {v4: uuidv4} = require('uuid')
let uniqueFilename = ''
require('dotenv').config()


app.use(session({
    secret: 'SuperSecretPassword',
    saveUninitialized: true
}))

app.use(express.urlencoded())
app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')

//Function to upload files
function uploadFile(req,callback){
    new formidable.IncomingForm().parse(req)
    .on('fileBegin',(name,file)=>{

        uniqueFilename = `${uuidv4()}.${file.originalFilename.split('.').pop()}`;
        file.name = uniqueFilename
        file.filepath = __dirname + '/uploads/' + uniqueFilename
    })
    .on('file',(name,file)=>{
        callback(file.name)

    })
}




// GET ROUTES
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/login', (req, res)=>{
    res.render('login')
})

app.get('/register', (req,res)=>{
    res.render('register')
})

app.get('/user', (req,res)=>{
    
    res.render('user')
   
})

app.get('/phealth', (req,res)=>{
    res.render('phealth')
})

app.get('/mhealth',(req,res)=>{
    res.render('mhealth')
})

app.get('/add-user-goal', (req,res)=>{
    res.render('add-user-goal')
})

app.get('/user-goals', async (req,res)=>{
    const userGoals = await models.usergoal.findAll({}) 
    res.render('user-goals', {userGoals: userGoals})
})

//POST ROUTES
app.post('/upload',(req,res)=>{

    uploadFile(req,(photoURL)=>{
        photoURL = `/uploads/${photoURL}`
        res.render('user', {imageURL: photoURL, className: 'profile-picture' })
    })
})

app.post('/add-user-goal', async (req,res)=>{
    const {goal, description, completed} = req.body
    

    const userGoal = models.usergoal.build({
        goal: goal,
        description: description,
        completed: completed 
    })

    const savedGoal = await userGoal.save()
    if(savedGoal){
        const userGoals = await models.usergoal.findAll({}) 
        res.render('user-goals', {userGoals: userGoals})
    }else{
        res.send('Not able to create new user goal')
    }
})



app.listen(8080,() => {
    console.log('Server is running healthy!')
})














// Dance Kirby! 

//  <("<)   ^( " )^   (>")>

// Wow Kirby... you're not a good dancer

// t("t)

//Fuck You Too Kirby