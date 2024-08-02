var express = require('express');
var router = express.Router();
var sql = require('mssql')

router.get('/', async function (req, res, next) {
    try {
        const result = await sql.query(`SELECT id, make, model, year FROM car`);
        res.json(result.recordset);
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

router.get('/:carId/edit', async function (req, res, next) {
    const carId = req.params.carId;
    try {
        const result = await sql.query(`SELECT id, make, model, year FROM car WHERE id=${carId}`);
        res.render('edit', { car: result.recordset[0] });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

router.post('/', async function (req, res) {
    var make = req.body.make;
    var model = req.body.model;
    var year = req.body.year;
    try {
        const query = `INSERT INTO car (make,model,year) VALUES ('${make}','${model}',${year})`;
        await sql.query(query);
        res.send("Car added");
    } catch (err) {
        console.log(err);
        res.send("Insert failed");
    }
});

router.post('/:carId/update', async function (req, res, next) {
    const carId = req.params.carId;
    const { make, model, year } = req.body;
    try {
        await sql.query(`UPDATE car SET make='${make}', model='${model}', year=${year} WHERE id=${carId}`);
        res.redirect('/display');
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

router.delete('/:carId/delete', async function (req, res, next) {
    const carId = req.params.carId;
    try {
        await sql.query(`DELETE FROM car WHERE id = ${carId}`);
        res.redirect('/display');
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

module.exports = router;