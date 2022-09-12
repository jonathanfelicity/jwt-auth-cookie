const jwt = require('jsonwebtoken')


const validateCookie =(req, res, next)=>{

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
