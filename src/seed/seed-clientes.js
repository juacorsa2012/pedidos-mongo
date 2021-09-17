import mongoose from 'mongoose'
import Cliente from '../models/cliente.model.js'
import * as config from '../config/config.js'

const seedClientes = async (docs) => {
  try {        
      await Cliente.deleteMany()  
      for (let i = 0; i < docs; i++) {                      
        const cliente = { nombre : "Cliente " + i }                
        await Cliente.create(cliente)
        let progreso = Math.ceil((i/docs)*100) + '%'
        process.stdout.write('Progreso: ' + progreso + '\r')
      }      
  } catch(err) {
      console.log(err)
  }
}

const n = +process.argv[2]
mongoose.connect(config.DB)

console.log(`Cargando ${n} clientes...`)

seedClientes(n).then(() => {
  console.log('Proceso finalizado correctamente')
  process.exit()
})