import express  from "express";
import  jwt  from "jsonwebtoken";
import * as dotenv from "dotenv"
dotenv.config()

const app =  express()
app.use(express.json())

const posts = [
    {
        name: "ferian"
    },
    {
        name: "mahlaw"
    }
]

const TOKEN = process.env.TOKEN
const port = process.env.PORT

app.get('/posts', Auth, (req,res)=>{

   res.json(posts.filter(post=> post.name === req.user.name ))

})


app.post('/login', (req,res)=>{

    const {username} = req.body
    const user = {  name: username }

    const accessToken = jwt.sign(user, TOKEN)
    res.json({accessToken})

})

function Auth (req,res,next){

    const authHeader = req.headers['authorization']
    const token = authHeader.split(' ')[1]
   
    if(token ==null) return res.sendStatus(401)

    jwt.verify(token, TOKEN, (err,user)=>{
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}


app.listen(port);