import mongoose from 'mongoose'
import Proveedor from '../models/proveedor.model.js'
import * as config from '../config/config.js'

const seedProveedores = async (docs) => {
  try {        
      await Proveedor.deleteMany()  
      for (let i = 0; i < docs; i++) {                      
        const proveedor = { nombre : "Proveedor " + i }                
        await Proveedor.create(proveedor)
        let progreso = Math.ceil((i/docs)*100) + '%'
        process.stdout.write('Progreso: ' + progreso + '\r')
      }      
  } catch(err) {
      console.log(err)
  }
}

const n = +process.argv[2]
mongoose.connect(config.DB)

console.log(`Cargando ${n} proveedores...`)

seedProveedores(n).then(() => {
  console.log('Proceso finalizado correctamente')
  process.exit()
})