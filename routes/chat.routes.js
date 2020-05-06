const express = require('express')
const router = express.Router();
const http = require('http').Server(router);
const path = require('path');
const io = require('socket.io')(http);






module.exports = router;