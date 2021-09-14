//const dotenv = require('dotenv')
import app from './app.js'
import * as Mensaje from './config/mensajes.js'
//dotenv.config({ path: './config/.env' })

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`${Mensaje.SERVIDOR_CORRIENDO} ${PORT}...`)  
})

export default server