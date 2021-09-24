import mongoose from 'mongoose'
import faker from  'faker'
import Cliente from '../models/cliente.model.js'
import Pedido from '../models/pedido.model.js'
import Proveedor from '../models/proveedor.model.js'
import { DB } from '../config/config.js'
import { ESTADO_PEDIDO, ESTADO_PREPARADO, ESTADO_ENTREGADO } from '../config/constantes.js'

const seedPedidos = async (docs) => {  
  try {
      await Pedido.deleteMany()
      const nClientes = await Cliente.countDocuments()
      const nProveedores = await Proveedor.countDocuments()      
  
      for (let i = 0; i < docs; i++) {
          let r = Math.floor(Math.random() * nClientes)
          const cliente = await Cliente.find().select('_id').limit(1).skip(r)

          r = Math.floor(Math.random() * nProveedores)
          const proveedor = await Proveedor.find().select('_id').limit(1).skip(r)

          faker.locale = 'es'
          const estados = [ESTADO_PEDIDO, ESTADO_PREPARADO, ESTADO_ENTREGADO]
          const i = faker.datatype.number({ 'min': 0, 'max': 2 })
          
          const pedido = {
              producto : faker.commerce.product(),
              cliente  : cliente[0]._id,
              proveedor: proveedor[0]._id,              
              observaciones: faker.commerce.productDescription(),
              unidades  : faker.datatype.number({ 'min': 1, 'max': 1000 }),
              referencia: faker.lorem.word(), 
              oferta    : faker.datatype.number({ 'min': 1, 'max': 1000 }),
              estado    : estados[i]
            }                

          await Pedido.create(pedido)          
      }            
  } catch(err) {
      console.log(err)
  }
}

const n = +process.argv[2]
mongoose.connect(DB)

console.log(`Cargando ${n} pedidos...`)
seedPedidos(n).then(() => {
  console.log('Proceso finalizado correctamente')
  process.exit()
})  