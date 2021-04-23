var express = require('express');
var router = express.Router();
var util = require('../util');

router.post('/add', async (req, res, next) => {
  
  if (!req.body.codigo || !req.body.valor || !req.body.data || !req.body.cpf) {
    return res.json({message: 'Campos obrigatórios não informados!'});
  }

  let newSale = {
    "saleCode": req.body.codigo,
    "salePrice": parseInt(req.body.valor),
    "saleDate": new Date(req.body.data),
    "retailerCpf": req.body.cpf,
    "status": parseInt(req.body.cpf) === 15350946056 ? "Aprovado" : "Em validação",
    "cashbackPercentage": util.getCashBackPercentage(parseInt(req.body.valor))
  };

  try {
    await global.db.insertSale(newSale);
    res.json({message: 'Compra cadastrada com sucesso!'});
  } catch (err) {
    next(err);
  }
});

router.post('/edit', async (req, res, next) => {
    let id = req.body.id;
    let editSale;
    try {
        editSale = await global.db.findSale(id);
        if (editSale && editSale.status === "Em validação") {
            let newSaleEdit = {
                "saleCode": editSale.saleCode,
                "salePrice": parseInt(req.body.valor),
                "saleDate": new Date(req.body.data),
                "retailerCpf": editSale.retailerCpf,
                "status": editSale.status,
                "cashbackPercentage": util.getCashBackPercentage(parseInt(req.body.valor))
              };
            await global.db.updateSale(id, newSaleEdit);
            res.json({message: 'Venda atualizada com sucesso!'});
        } else {
            return res.json({message: 'Compra não encontrada ou sem permissão para atualização!'});
        }
    } catch (err) {
      next(err);
    }
  });

  router.delete('/delete', async (req, res, next) => {
    let id = req.body.id;
    let deleteSale;
    try {
        deleteSale = await global.db.findSale(id);
        if (deleteSale && deleteSale.status === "Em validação") {
            await global.db.deleteSale(id);
            res.json({message: 'Venda excluída com sucesso!'});
        } else {
            return res.json({message: 'Essa Compra não pode ser excluída!'});
        }
    } catch (err) {
      next(err);
    }
  });

module.exports = router;
