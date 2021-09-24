import mongoose from 'mongoose'
import { NOMBRE_REQUERIDO } from '../config/mensajes.js'

const clienteSchema = new mongoose.Schema(
{
    nombre: {
        type: String,
        required: [true, NOMBRE_REQUERIDO],
        unique: true,
        trim: true        
      }
    }  
)

const Cliente = mongoose.model('Cliente', clienteSchema, 'clientes')

export default Cliente