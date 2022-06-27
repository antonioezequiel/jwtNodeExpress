const usuariosDao = require('./usuarios-dao');
const { InvalidArgumentError } = require('../erros');
const validacoes = require('../validacoes-comuns');
const bcrypt = require('bcrypt');

class Usuario {
  constructor(usuario) {
    this.id = usuario.id;
    this.nome = usuario.nome;
    this.email = usuario.email;
    this.emailVerificado = usuario.emailVerificado
    this.cargo = usuario.cargo;
    this.valida();
  }

  async verifiacarEmail () {
    this.emailVerificado = 1;
    await usuariosDao.modificaEmailVerificado(this);
  }
  async adiciona() {
    if (await Usuario.buscaPorEmail(this.email)) {
      throw new InvalidArgumentError('O usuário já existe!');
    }

    await usuariosDao.adiciona(this);
    const {id} = await usuariosDao.buscaPorEmail(this.email);
    this.id = id;
    return this;
  }

  valida() {
    validacoes.campoStringNaoNulo(this.nome, 'nome');
    validacoes.campoStringNaoNulo(this.email, 'email');
    validacoes.campoStringNaoNulo(this.cargo, 'cargo');
  }

  
  async deleta() {
    return usuariosDao.deleta(this);
  }

  async adicionaSenha(senha){
    validacoes.campoStringNaoNulo(senha, 'senha');
    validacoes.campoTamanhoMinimo(senha, 'senha', 8);
    validacoes.campoTamanhoMaximo(senha, 'senha', 64);
    this.senha = await Usuario.gerarSenhaHash(senha);
  }
  
  static async buscaPorId(id) {
    const usuario = await usuariosDao.buscaPorId(id);
    if (!usuario) {
      return null;
    }
    
    return new Usuario(usuario);
  }
  
  static async buscaPorEmail(email) {
    const usuario = await usuariosDao.buscaPorEmail(email);
    if (!usuario) {
      return null;
    }
    const u =  new Usuario(usuario);
    u.senha = usuario.senha;
    return u;
  }

  static lista() {
    return usuariosDao.lista();
  }

  static gerarSenhaHash(senha){
    const custo = 12;
    return bcrypt.hash(senha, custo);
  }
}

module.exports = Usuario;
