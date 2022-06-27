const postsControlador = require('./posts-controlador');
const {middlewareAutentication} = require('../usuarios');
const autorizacao = require('../middleware/autorizacao');


module.exports = app => {
  app
    .route('/post')
    .get([middlewareAutentication.bearer, autorizacao('post', 'ler')], postsControlador.lista)
    .post([middlewareAutentication.bearer, autorizacao('post', 'criar')], postsControlador.adiciona);
    app
    .route('/post/:id')
    .delete([middlewareAutentication.bearer, autorizacao('post', 'remover')], postsControlador.delete);
    app
    .route('/post/:id')
    .get([middlewareAutentication.bearer, autorizacao(['ADM', 'EDITOR', 'ASSINANTE'])], postsControlador.getById);
   
};
