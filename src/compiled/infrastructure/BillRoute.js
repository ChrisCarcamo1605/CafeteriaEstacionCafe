"use strict";
const { Router } = require('express');
const router = Router();
const controller = require('../../controller/BillController');
router.get('/bills', controller.list);
module.exports = router;
