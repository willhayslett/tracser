const sqlite3 = require("sqlite3").verbose();
const path = require('path');
const realtracserDb = path.join(__dirname, "realtracser.db");
const { 
  createHomes, getHomes, setHome, getMlsNumbers 
} = require('./dataAccess/queryProvider');


/*GLOBAL*/
global.storageInit = false;

/**
 * database namespace
 * @namespace database
 */
const database = module.exports;

database.createDb = async () => {
  if (!global.storageInit) {
    database.db = new sqlite3.Database(realtracserDb, (err) => {
      if (err) {
        return console.error('error encountered when connecting to therealtracser.db', err);
      }
      
      console.log('successfully connected to the realtracser.db');
      global.storageInit = true;
      return database.createDbSchema();
    });
  }
}

database.createDbSchema = async () => {
  return new Promise((resolve, reject) => {
    database.db.run(createHomes, (err) => {
      if (err) {
        console.error(
          'error encountered when creating HOME table', err
        );
        reject(err);
      }
  
      console.log('HOME table created successfully or already exists');
      resolve(database.db);
    });
  });
}

database.insertHomes = async (homes) => {
  return new Promise((resolve, reject) => {
    console.log("Inserting new homes into the database");
    const dbStatement = database.db.prepare(setHome);

    homes.forEach(home => {
      const binds = Object.keys(home).reduce((bindObj, key) => {
        bindObj[`$${key}`] = home[key];
        return bindObj;
      }, {});
      dbStatement.run(binds);
    });

    dbStatement.finalize((err) => {
      if (err) {
        console.error('error encountered when inserting homes');
        reject(err); 
      }
      resolve();
    });
  });
}

database.getHomes = async () => {
  return new Promise((resolve, reject) => {
    database.db.all(getHomes, (err, rows) => {
      if (err) { 
        console.error('error when retreiving homes', err);
        reject(err);
      }
  
      console.log('homes successfully retrieved');
      resolve(rows);
    })
  });
}

database.getMlsNumbers = async () => {
  return new Promise((resolve, reject) => {
    database.db.all(getMlsNumbers, [], (err, rows) => {
      if (err) {
        console.error('error when retreiving mlsNumbers', err);
        reject(err);
      }
  
      console.log('mlsNumbers successfully retrieved');
      resolve(rows);
    })
  })
}

database.getHome = async (binds) => {
  return new Promise((resolve, reject) => {
    database.db.get(getHome, binds, (err, rows) => {
      if (err) {
        console.error('error when retreiving home', err);
        reject(err);
      }
  
      resolve(rows);
    })
  });
}
