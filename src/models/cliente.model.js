import mongoose from 'mongoose'
import * as Mensaje from '../config/mensajes.js'

const clienteSchema = new mongoose.Schema(
{
    nombre: {
        type: String,
        required: [true, Mensaje.NOMBRE_REQUERIDO],
        unique: true,
        trim: true        
      }
    }  
)

const Cliente = mongoose.model('Cliente', clienteSchema, 'clientes')

export default Cliente