const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')



const app = express()


const User = require('./models/UserModel')


const validateCookie = (req, res, next)=>{

    const token = req.cookies.token
    console.log(token)
    try{
        const user = jwt.verify(token, 'topsecret')
        console.log(user)
        req.user = user
        next()

    }catch{
        res.clearCookie('token')
        return res.redirect('/login')
    }

}


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

mongoose.connect('mongodb://localhost:27017/jwt')
    .then(()=>{
        app.get('/', (req, res)=>{
            res.render('home')
        })
        app.get('/register', (req, res)=>{
            res.render('register')
        })
        app.get('/login', (req, res)=>{
            res.render('login')
        })


        app.post('/register', (req, res)=>{
            const { name, email, password } = req.body
            bcrypt.hash(password, 10, (e, hash)=>{
                user = new User({
                    name, email, password:hash
                })
                user.save()
                    .then(()=>{
                        return res.redirect('/login')
                    })
                    .catch((e)=>{
                        console.log(e)
                        return res.redirect('/register')
                    })
            })

        })

        app.post('/login', (req, res)=>{
            const { mail, password } = req.body
            User.findOne({ email: mail }).exec()
                .then((user)=>{
                    if(user){
                        bcrypt.compare(password, user.password, (e, isMatch)=>{
                            if(e){
                                console.log(e)
                                return
                            }
                            if(isMatch){
                                const token = jwt.sign(user.toJSON(), 'topsecret', { expiresIn: '48h'})
                                res.cookie('token', token, {
                                    httpOnly: true,
                                    // secure: true,
                                    // signed: true
                                })
                                return res.redirect('/dashboard')
                            }
                            else{
                                res.send("Wrong password")
                                return
                            }
                        })
                        
                        return
                    }
                    res.send("no user")
                    return
                })
                .catch((e)=>{
                    res.send(e)
                })
        })


        app.get('/dashboard', validateCookie, (req, res)=>{
            res.render('dashboard', {user: req.user})
        })


        app.listen(5000, ()=>{
            console.log("server running")
        })
    })
    .catch((e)=>{
        console.log('cannot connect to db', e)
    })