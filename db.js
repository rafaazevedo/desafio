const mongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
mongoClient.connect("mongodb://localhost", { useUnifiedTopology: true })
            .then(conn => global.conn = conn.db("desafio"))
            .catch(err => console.log(err))

function insertRetailer(retailer) {
    return global.conn.collection("retailer").insertOne(retailer);
}

function insertSale(sale) {
    return global.conn.collection("sales").insertOne(sale);
}

function findSale(id) {
    return global.conn.collection("sales").findOne(new ObjectId(id));
}

function updateSale(id, sale) {
    return global.conn.collection("sales").updateOne({ _id: new ObjectId(id) }, { $set: sale });
}

function deleteSale(id) {
    return global.conn.collection("sales").deleteOne({ _id: new ObjectId(id) });
}


module.exports = { insertRetailer, insertSale, findSale, updateSale, deleteSale }