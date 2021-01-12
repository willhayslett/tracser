'use strict';

const fs = require('fs');
const path = require('path');

module.exports = {
  createHomes: fs.readFileSync(path.join(__dirname, '/sql/createHomes.sql'), { encoding: 'utf8' }),
  getHomes: fs.readFileSync(path.join(__dirname, '/sql/getHomes.sql'), { encoding: 'utf8' }),
  getHome: fs.readFileSync(path.join(__dirname, '/sql/getHome.sql'), { encoding: 'utf8' }),
  setHome: fs.readFileSync(path.join(__dirname, '/sql/setHome.sql'), { encoding: 'utf8' }),
  getMlsNumbers: fs.readFileSync(path.join(__dirname, '/sql/getMlsNumbers.sql'), { encoding: 'utf8' })
}