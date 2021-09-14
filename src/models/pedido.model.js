import mongoose from 'mongoose'
import * as Mensaje from './config/mensajes.js'

const pedidoSchema = new mongoose.Schema(
{
  producto: {
    type: String,
    required: [true, Mensaje.PRODUCTO_REQUERIDO],    
    trim: true            
  },
  unidades: {
    type: Number,
    required: [true, Mensaje.UNIDADES_REQUERIDO]
  },
  referencia: {
    type: String,    
    trim: true        
  },
  oferta: {
    type: String,    
    trim: true        
  },
  observaciones: {
    type: String,    
    trim: true        
  },
  parte: {
    type: String,    
    trim: true        
  },
  estado: {
    type: String,
    enum : ['pedido','preparado','entregado','facturado','devuelto'],
    default: 'pedido' 
  },
  created_at: {
    type: Date,
    default: Date.now(),
    select: false
  },
  cliente: {
    type: mongoose.Schema.ObjectId,
    ref: 'Cliente',
    required: [true, Mensaje.CLIENTE_REQUERIDO]
  },
  proveedor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Proveedor',
    required: [true, Mensaje.PROVEEDOR_REQUERIDO]
  }
})

const Pedido = mongoose.model('Pedido', pedidoSchema, 'pedidos')

export default Pedido