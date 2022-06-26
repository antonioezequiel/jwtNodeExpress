const passport = require('passport');
const jwt = require('jsonwebtoken');
const Usuario = require('./usuarios-modelo.js');

module.exports = {
    local: (req, resp, next) => {
        passport.authenticate(
            'local', 
            {session: false}, 
            (err, usuario, info) => {
                if(err && err.name === 'InvalidArgumentError')
                    return resp.status(401).json({message: err.message});
                if(err)
                    return resp.status(500).json({message: err.message});
                if(!usuario)
                    return resp.status(401).json();
                
                req.user = usuario; 
                return next();
            }
        )(req, resp, next);
    }, 
    bearer: (req, resp, next) => {
        passport.authenticate(
            'bearer', 
            {session: false}, 
            (err, usuario, info) => {
               
                if(err && err.name === 'JsonWebTokenError')
                    return resp.status(401).json({message: err.message});
                if(err && err.name === 'TokenExpiredError')
                    return resp.status(401).json({message: err.message, ExpiradoEm: err.expiredAt});
                ///if (err && err.name === 'ExpirationError')
               //  return resp.status(401).json({message: err.message});
                if(err)
                    return resp.status(500).json({message: err.message});
                if(!usuario)
                    return resp.status(401).json();
                
                req.user = usuario; 
                
                return next();
            }
        )(req, resp, next);
    }, 
    validarEmail: async (req, resp, next) => {
        try {            
            const {token} = req.params;
            const id = validaTokenVerificacaoEmail(token);
            req.user = await Usuario.buscaPorId(id);
            return next(); 
        } catch (error) {
            if (error && error.name === 'JsonWebTokenError')
               return resp.status(401).json({message: error.message});
            if(error && error.name === 'TokenExpiredError')
                return resp.status(401).json({message: error.message, expiredAt: error.expiredAt});
            if(error)
               return resp.status(500).json({message: error.message})
        }
    }
}

function validaTokenVerificacaoEmail(token){
    const {id} = jwt.verify(token, process.env.CHAVE_JWT);
    return id;
}