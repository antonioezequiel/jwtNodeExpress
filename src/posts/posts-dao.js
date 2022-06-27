const db = require('../../database');

module.exports = {
  adiciona: post => {
    return new Promise((resolve, reject) => {
      db.run(
        `
        INSERT INTO posts (
          titulo, 
          conteudo
        ) VALUES (?, ?)
      `,
        [post.titulo, post.conteudo],
        erro => {
          if (erro) {
            return reject('Erro ao adicionar o post!');
          }

          return resolve();
        }
      );
    });
  },

  lista: () => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM posts`, (erro, resultados) => {
        if (erro) {
          return reject('Erro ao listar os posts!');
        }

        return resolve(resultados);
      });
    });
  },
  getById: (id) => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM posts where id = ?`,[id], (erro, resultados) => {
        if (erro) {
          return reject('Erro ao listar os posts!');
        }

        return resolve(resultados);
      });
    });
  },
  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.run(`delete FROM posts where id = ?`, [id], erro => {
        if (erro) {
          return reject('Erro ao deletar os posts!');
        }
        return resolve();
      });
    });
  }
};
