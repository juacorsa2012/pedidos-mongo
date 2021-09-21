import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt  from 'bcryptjs'
import * as Mensaje from '../config/mensajes.js'
import * as Constante from '../config/constantes.js'

const usuarioSchema = new mongoose.Schema(
{
    nombre: {
        type: String,
        required: [true, Mensaje.NOMBRE_REQUERIDO],      
        trim: true
    },
    
    email: {
        type: String,
        required: [true, Mensaje.EMAIL_REQUERIDO],      
        unique: true,
        lowercase: true,        
        validate: [validator.isEmail, Mensaje.EMAIL_NO_VALIDO]
    },

    password: {
        type: String,
        required: [true, Mensaje.PASSWORD_REQUERIDO],             
        minlength: [8, Mensaje.PASSWORD_CORTO   ],
        select: false
    },

    rol: {
        type: String,
        enum: [Constante.ROL_ADMIN, Constante.ROL_USER],
        default: Constante.ROL_USER
    },   
    
    created_at: {
        type: Date,
        default: Date.now(),
        select: false
    }
})

usuarioSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
})

usuarioSchema.methods.esPasswordCorrecto = async function(bodyPassword, userPassword) {
    return await bcrypt.compare(bodyPassword, userPassword)
}

const Usuario = mongoose.model('Usuario', usuarioSchema, 'usuarios')

export default Usuario