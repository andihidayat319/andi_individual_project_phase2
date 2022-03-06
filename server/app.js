if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}
const cors = require('cors')
const express = require('express')
const router = require('./routes/router.js')
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use('/', router)
app.listen(port, () => console.log('Berjalan pada port', port))
