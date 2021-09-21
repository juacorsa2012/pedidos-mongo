import dotenv from 'dotenv'
import path from 'path'

const __dirname = path.resolve() + '/src/config'

dotenv.config({
  path: path.resolve(__dirname, process.env.NODE_ENV + '.env')
})

const PORT = process.env.PORT
const HOST = process.env.HOST
const DB   = process.env.DATABASE
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN

export {
  HOST,
  PORT,
  DB,
  JWT_EXPIRES_IN,
  JWT_SECRET
}