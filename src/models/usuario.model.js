import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt  from 'bcryptjs'
import { EMAIL_NO_VALIDO, EMAIL_REQUERIDO, NOMBRE_REQUERIDO, PASSWORD_CORTO, PASSWORD_REQUERIDO } from '../config/mensajes.js'
import { ROL_ADMIN, ROL_USER} from '../config/constantes.js'

const usuarioSchema = new mongoose.Schema(
{
    nombre: {
        type: String,
        required: [true, NOMBRE_REQUERIDO],      
        trim: true
    },
    
    email: {
        type: String,
        required: [true, EMAIL_REQUERIDO],      
        unique: true,
        lowercase: true,        
        validate: [validator.isEmail, EMAIL_NO_VALIDO]
    },

    password: {
        type: String,
        required: [true, PASSWORD_REQUERIDO],             
        minlength: [8, PASSWORD_CORTO],
        select: false
    },

    rol: {
        type: String,
        enum: [ROL_ADMIN, ROL_USER],
        default: ROL_USER
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