function getCashBackPercentage(price) {
    let cashback;
    if (price <= 1000) {
        cashback = "10";
    } else if (price > 1000 && price <= 1500) {
        cashback = "15";
    } else if (price > 1500) {
        cashback = "20";
    }
    return cashback;
}

function getSaleListResponse(saleList, totalSale) {
    let saleListResponse = [];
    for (let i = 0; i < saleList.length; i++) {
        let item = {
            "Código": saleList[i].saleCode,
            "Valor": saleList[i].salePrice.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}),
            "Data": (saleList[i].saleDate.getDate() + 1) + "/" + (saleList[i].saleDate.getMonth() + 1) + "/" + saleList[i].saleDate.getFullYear(),
            "%Cashback": parseInt(saleList[i].cashbackPercentage),
            "Valor Cashback": getCashBackValue(parseInt(saleList[i].cashbackPercentage),totalSale),
            "Status": saleList[i].status
        }
        saleListResponse.push(item);
    }
    return saleListResponse;
}

function getCashBackValue(percentage, totalSale) {
    let response = percentage * totalSale / 100;
    return response.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
}

module.exports = { getCashBackPercentage, getSaleListResponse }