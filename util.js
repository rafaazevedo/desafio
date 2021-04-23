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


module.exports = { getCashBackPercentage }