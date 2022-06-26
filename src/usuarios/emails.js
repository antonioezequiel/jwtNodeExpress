const nodeMailer = require('nodemailer');

class Email {
    constructor(from, to, subject, text, html){
        this.from = from;
        this.to = to;
        this.html = html;
        this.subject = subject;
        this.text = text;
    }
    async enviarEmail(){
        const contaTeste = await nodeMailer.createTestAccount();
        
        const transportador = nodeMailer.createTransport({
            host: 'smtp.ethereal.email',
            auth: contaTeste,
            tls: {
                rejectUnauthorized: false
            }
        });
        console.log(this);
        const info = await transportador.sendMail(this);
        
        console.log(nodeMailer.getTestMessageUrl(info));
    }
}

class EmailVerificacao extends Email {
    constructor(usuario, endereco) {
        super('"Blog do código" noreplay@blogdocodigo.com.br',
        usuario.email, 
        'Verificação de Email!',
        'Olá, valide seu email',
        `<h2>Olá, clique no link para confirmar seu cadastro no blog do código: <a href='${endereco}'>Clique aqui para validar seu e-mail</a></h2>`)
    }
}


module.exports = {EmailVerificacao};