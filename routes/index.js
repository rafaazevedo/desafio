const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', async (req, res, next) => {
  if (!req.body.email || !req.body.senha) {
    return res.json({message: 'Informe seu usuário e senha!'});
  }
  let credentials = {
    "email": req.body.email,
    "senha": req.body.senha
  }
  try {
    let retailer = await global.db.findeRetailer(credentials.email);
    if (retailer && retailer.length) {
      if (retailer[0].email === credentials.email && retailer[0].password === credentials.senha) {
        res.json({message: 'Revendedor validado com sucesso. Bem-vindo ' + retailer[0].name + '!'});
      } else {
        res.json({message: 'Usuário e/ou senha incorreto(s)'});
      }
    } else {
      res.json({message: 'Revendedor não encontrado!'});
    }
  } catch (error) {
    next(err);
  }
});

module.exports = router;
