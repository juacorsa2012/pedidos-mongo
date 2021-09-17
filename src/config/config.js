import dotenv from 'dotenv'
import path from 'path'

const __dirname = path.resolve() + '/src/config'

dotenv.config({
  path: path.resolve(__dirname, process.env.NODE_ENV + '.env')
})

const PORT = process.env.PORT
const HOST = process.env.HOST
const DB   = process.env.DATABASE

export {
  HOST,
  PORT,
  DB
}