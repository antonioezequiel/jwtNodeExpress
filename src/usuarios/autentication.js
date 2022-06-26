const passport = require('passport');
const { InvalidArgumentError, ExpirationError } = require('../erros');
const passportLocal = require('passport-local').Strategy;
const Usuario = require('./usuarios-modelo.js');
const bcrypt = require('bcrypt');
const Bearer = require('passport-http-bearer').Strategy;
const jwt = require('jsonwebtoken');

passport.use(
    new passportLocal({
      usernameField: 'email',
      passwordField: 'senha',
      session: false
    }, async (email, senha, done) => {
        try {
            const usuario = await Usuario.buscaPorEmail(email);
            await validaUsuarioSenha(usuario, senha);
            done(null, usuario);
        }catch(err){
            done(err)
        }
    })
)

passport.use(
    new Bearer(async (token, done) => {
        try {
            const payload = jwt.verify(token, process.env.CHAVE_JWT);
            const usuario = await Usuario.buscaPorId(payload.id);
           // verificaExpiracao(payload.expiraEm);
            done(null, usuario);
        } catch(err) {
            done(err, null);
        }
    })
)

async function validaUsuarioSenha(usuario, senha){
    if (!usuario)
        throw new InvalidArgumentError('Não Existe usuário para esse e-mail');
  
    const validaSenha = await bcrypt.compare(senha, usuario.senha);

    if(!validaSenha)
        throw new InvalidArgumentError('Senha inválida');
}

function verificaExpiracao(tempoExpiracao) {
    if (tempoExpiracao > Date.now()) {
      throw new ExpirationError('Token expirado!');
    }
}