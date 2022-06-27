const controle = require('../controleAcesso');

const metodos = {
    ler: {
        todos: 'readAny',
        apenasSeu: 'readOwn'
    },
    criar : {
        todos: 'createAny',
        apenasSeu: 'createOwn'
    },
    remover: {
        todos: 'createAny',
        apenasSeu: 'createOwn'
    }
}
module.exports = (entidade, acao) => (req, resp, next) => {
    const permissaoCargo = controle.can(req.user.cargo);
    const acoes = metodos[acao];
    const permissaoTodos = permissaoCargo[acoes.todos](entidade);
    const permissaoAny = permissaoCargo[acoes.apenasSeu](entidade);
    
    if(permissaoTodos.granted === false && permissaoAny.granted === false) {
        console.log('cargo não autorizado');
        return resp.status(403).json({message:'Usuario não autorizado a excutar essa operação'})
    }

    req.acesso = {
        todos: {
            permitido: permissaoTodos.grant,
            atributos: permissaoTodos.attributes
        },
        apenasSeu: {
            permitido: permissaoAny.grant,
            atributos: permissaoAny.attributes
        }
    }
    return next();
}