
import mongoose from  'mongoose'

const conectarDB = (url) => {
 mongoose.connect(url)
  .then(() => console.log(`Database: ${url}`))
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })  
}

export default conectarDB