const express = require('express');

const orderController = require("../controllers/orderController")
const validation = require("../validation/orderSchemaValidation")

const router = express.Router()

router.post('/create', validation.createOrderValidation, orderController.createOrderController)

router.get('/list', orderController.listOrderController)

router.post('/remove', validation.removeOrderValidation, orderController.removeOrderController)




module.exports = router