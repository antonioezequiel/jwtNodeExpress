const AccessControl = require('accesscontrol');
const controle = new AccessControl();

controle.grant('ASSINANTE')
.readAny('post', ['id', 'titulo', 'conteudo']);
controle.grant('EDITOR')
 .extend('ASSINANTE')
 .createOwn('post')
 .deleteOwn('post');
controle.grant('ADM')
 .extend('ASSINANTE')
 .createAny('post')
 .deleteAny('post')
 .deleteAny('usuario');

module.exports = controle;