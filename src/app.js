import express from 'express'
import * as config from './config/config.js'
import conectarDB from './db/db.js'

const app = express()

app.use(express.json())

app.set("port", config.PORT)
app.set("host", config.HOST)

conectarDB(config.DB)








export default app