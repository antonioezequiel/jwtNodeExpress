module.exports = {
  rotas: require('./usuarios-rotas'),
  controlador: require('./usuarios-controlador'),
  modelo: require('./usuarios-modelo'),
  autentication: require('./autentication.js'),
  middlewareAutentication: require('./middlewares-autentication')
}