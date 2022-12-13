import express  from "express";
import  jwt  from "jsonwebtoken";
import * as dotenv from "dotenv"
dotenv.config()

const app =  express();
app.use(express.json())

let refreshTokensDB = []
const port = process.env.PORT2
const Token = process.env.Token;
const refreshTokenkey = process.env.refresh_Token

app.post('/token', (req,res)=>{
    const refreshToken  = req.body.token

    if(refreshToken == null) return res.sendStatus(401)
    if(!refreshTokensDB.includes(refreshToken)) return res.sendStatus(403)

    jwt.verify(refreshToken,  refreshTokenkey, (err,user)=>{

        if(err) return res.sendStatus(403)
        const accessToken = generateAccessToken({name:user.name})
        res.json({accessToken})
    })
})

app.delete("/logout", (req,res)=>{

    refreshTokensDB = refreshTokensDB.filter(token=> token !==req.body.token)
    res.sendStatus(204);
})

app.post('/login', (req,res)=>{

    const {username} = req.body
    const user = {  name: username }

    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user,  refreshTokenkey)
    refreshTokensDB.push(refreshToken)

    res.json({accessToken,refreshToken})

})

function generateAccessToken(user){

    return jwt.sign(user, Token, {expiresIn: '30s'})

}


app.listen(port);