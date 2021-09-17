import mongoose from 'mongoose'
import * as Mensaje from '../config/mensajes.js'

const proveedorSchema = new mongoose.Schema(
{
    nombre: {
        type: String,
        required: [true, Mensaje.NOMBRE_REQUERIDO],
        unique: true,
        trim: true        
      }
    }  
)

const Proveedor = mongoose.model('Proveedor', proveedorSchema, 'proveedores')

export default Proveedor