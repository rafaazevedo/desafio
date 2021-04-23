var express = require('express');
var router = express.Router();

router.post('/add', async (req, res, next) => {
  
  if (!req.body.nome || !req.body.cpf || !req.body.email || !req.body.senha) {
    return res.json({message: 'Campos obrigatórios não informados!'});
  }

  let newRetailer = {
    "name": req.body.nome,
    "cpf": req.body.cpf,
    "email": req.body.email,
    "password": req.body.senha
  };

  try {
    await global.db.insertRetailer(newRetailer);
    res.json({message: 'Revendedor cadastrado com sucesso!'});
  } catch (err) {
    next(err);
  }
});

module.exports = router;
