const Usuario = require('./usuarios-modelo');
const { InvalidArgumentError, InternalServerError } = require('../erros');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const moment = require('moment');
const {EmailVerificacao} = require('./emails.js');

function criaTokenJWT(usuario){
 // const cincoDiasEmMilissegundos = 432000000;
  //console.log(process.env.TEMPO_TOKEN)
  const payload = {
    id: usuario.id,
   // expiraEm: Date.now() + Number(process.env.TEMPO_TOKEN)
  };

  const token = jwt.sign(payload, process.env.CHAVE_JWT, {expiresIn: '25m'});
  return token;
}

function criaTokenVerificacaoEmail(usuario){
   const payload = {
     id: usuario.id,
   };

   const token = jwt.sign(payload, process.env.CHAVE_JWT, {expiresIn: '1d'});
   return token;
 }

function criaTokenOpaco(usuario){
  const dataExpiracao = moment().add(5, 'd').unix();
  return crypto.randomBytes(24).toString('hex');

}

module.exports = {
  adiciona: async (req, res) => {
    const { nome, email, senha, cargo } = req.body;
    try {
      const usuario = new Usuario({
        nome,
        email,
        cargo,
        emailVerificacao: false
      });
      
      await usuario.adicionaSenha(senha);
      await usuario.adiciona();
      const endereco = process.env.BASE_URL+'/usuario/verificar_email/' + criaTokenVerificacaoEmail(usuario);
      const emailVerificacao = new EmailVerificacao(usuario, endereco);
      emailVerificacao.enviarEmail().catch(console.log);
      res.status(201).json();
    } catch (erro) {
      if (erro instanceof InvalidArgumentError) {
        res.status(422).json({ erro: erro.message });
      } else if (erro instanceof InternalServerError) {
        res.status(500).json({ erro: erro.message });
      } else {
        res.status(500).json({ erro: erro.message });
      }
    }
  },

  login: (req, resp)=>{
    try {
      const token = criaTokenJWT(req.user);
      const tokenOpaco = criaTokenOpaco(req.user);
      resp.set('Authorization', token);
      resp.status(200).send({tokenOpaco});
    } catch (error) {
      resp.status(500).send({message: error.message});
    }
  },

   emailVerificacao: async (req, resp)=>{
    try {
      const usuario = req.user;
      await usuario.verifiacarEmail();
      resp.status(200).send({message: 'Email validado com sucesso'});
    } catch (error) {
      resp.status(500).send({message: error.message});
    }
  },

  lista: async (req, res) => {
    const usuarios = await Usuario.lista();
    res.json(usuarios);
  },

  deleta: async (req, res) => {
    const usuario = await Usuario.buscaPorId(req.params.id);
    try {
      await usuario.deleta();
      res.status(200).send();
    } catch (erro) {
      res.status(500).json({ erro: erro });
    }
  }
};
