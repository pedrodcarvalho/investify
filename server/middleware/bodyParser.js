const express = require('express');

module.exports = express.json({ limit: '1mb', type: 'application/json' });
