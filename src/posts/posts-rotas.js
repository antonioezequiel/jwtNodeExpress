const postsControlador = require('./posts-controlador');
const {middlewareAutentication} = require('../usuarios');


module.exports = app => {
  app
    .route('/post')
    .get(postsControlador.lista)
    .post(middlewareAutentication.bearer, postsControlador.adiciona);
};
