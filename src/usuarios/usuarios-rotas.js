const usuariosControlador = require('./usuarios-controlador');
const middlewareAutentication = require('./middlewares-autentication');


module.exports = app => {
  app
    .route('/usuario')
    .post(usuariosControlador.adiciona)
    .get(middlewareAutentication.bearer, usuariosControlador.lista);
  
  app.route('/usuario/login').post(middlewareAutentication.local, 
                  usuariosControlador.login);
  app.route('/usuario/verificar_email/:token').get(middlewareAutentication.validarEmail, usuariosControlador.emailVerificacao);
  app.route('/usuario/:id').delete(middlewareAutentication.bearer, usuariosControlador.deleta);
};
