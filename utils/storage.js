const storage = require('node-persist');
//global.storageInit = false;

module.exports = async ()=> {
  if (!global.storageInit) {
    await storage.init({
      dir: 'db',
      stringify: JSON.stringify,
      parse: JSON.parse,
      encoding: 'utf8',
      logging: true,  // can also be custom logging function
      ttl: false, // ttl* [NEW], can be true for 24h default or a number in MILLISECONDS or a valid Javascript Date object
      expiredInterval: 2 * 60 * 1000, // every 2 minutes the process will clean-up the expired cache
      forgiveParseErrors: false
    });

    global.storageInit = true;
    return storage;
  }

  return storage;
}