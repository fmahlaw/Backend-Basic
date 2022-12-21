const express = require ('express')

const app = express()
app.use(express.json())

app.post('/login', async (req, res) => {
  const { password, username } = req.body
  if (!(password && username)) return res.sendStatus(403)

  res.send({ userId: 0 })
})

module.exports = app