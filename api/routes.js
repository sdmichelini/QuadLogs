var express = require('express');

var router = express.Router();

var auth = require('./auth');
var flights = require('./flights');

router.use('/auth', auth);
router.use('/flights', flights);

module.exports = router;
