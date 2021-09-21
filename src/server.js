import app from './app.js'

const server = app.listen(app.get("port"), () => {
  console.log("Server is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  )
  console.log("Press CTRL-C to stop")
})

export default server