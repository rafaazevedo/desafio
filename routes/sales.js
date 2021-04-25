const express = require('express');
const router = express.Router();
const util = require('../util');
const https = require('https');

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

router.patch('/edit', async (req, res, next) => {
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
    res.json({message: 'Compra atualizada com sucesso!'});
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
        res.json({message: 'Compra excluída com sucesso!'});
    } else {
        return res.json({message: 'Essa Compra não pode ser excluída!'});
    }
  } catch (err) {
    next(err);
  }
});

router.post('/list', async (req, res, next) => {
  try {
    let totalSalesAmount =  await global.db.totalSales(req.body.cpf);
    let saleList = await global.db.listSale(req.body.cpf);
    let response = util.getSaleListResponse(saleList, totalSalesAmount[0].totalSaleAmount);
    res.json({response});
  } catch (err) {
    next(err);
  }
});

router.post('/cashback', async (req, res, next) => {
  let cpfParam = req.body.cpf;
  let token = req.body.token;
  try {
    let options = {headers: { token: token }};
    let responseCashback;
    https.get("https://mdaqk8ek5j.execute-api.us-east-1.amazonaws.com/v1/cashback?cpf=" + cpfParam + "", options, response => {  
      let data = "";
       
      response.on("data", d => {
        data += d
      });

      response.on("end", () => {
        responseCashback = JSON.parse(data).body;
        res.json({"Cashback Acumulado":responseCashback.credit.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})});
      });
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
