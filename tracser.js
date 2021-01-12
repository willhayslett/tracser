const schedule = require('node-schedule');
const getStorage = require('./utils/storage');
const crawler = require('./utils/crawler');
const sns = require('./utils/sns')
const url = require('url');
const db = require('./utils/database');

const base = 'https://www.realtracs.com';
const uri = process.env.REALTRACS_SEARCH_URL; //'https://www.realtracs.com/listings/search?sort=listDateDesc&propertyClasses=Residential&listingStatuses=1;7&price=null:375000&acres=0.25:null&openHouse=0&auction=1&zipCodes=7bd42452-63d6-480b-a34b-f445e4bfd42c:37218;b92bf878-599c-407f-8780-96d6689aa495:37207;66c29f4a-5b1f-4833-8745-2b8e6a5712f6:37208;c05a1fcb-db4d-4cf6-b1eb-5e3a69cee31e:37209;85a34830-c03c-40f3-9978-3dd5065ae8e9:37203&view=List';

start()
async function start(){
  const storage = await db.createDb();
  getRealtracsData(storage);
}

schedule.scheduleJob('*/5 * * * *', async () => {
  try {
    console.log('Getting RealTracs Data');
    await db.createDb();
    await getRealtracsData();
  } catch (error) {
    console.error('error encountered', error);
  }
});

async function getRealtracsData(){
  try {
    const newHomes = [];
    const $ = await crawler.getDom(uri);
    const mlsNumbers = await db.getMlsNumbers() || [];
    const table = $('#cdk-drop-list-0').find('tbody');
    
    console.log(`Found ${table.children().length} matches`);
    table.find('tr').each(async (i, html) => {
      const cells = $(html).find('td');
      const homeDetails = {
        mlsNumber: $(cells[0]).find('a').text().trim(),
        realTracsLink: url.resolve(base, $(cells[0]).find('a').attr('href')),
        realTracsImageLink: null,
        //underContract: $(cells[2]).text().trim().includes('svg'),
        address: $(cells[3]).text().trim(),
        city: $(cells[4]).text().trim(),
        zip: $(cells[5]).text().trim(),
        subdivision: $(cells[6]).text().trim(),
        squareFootage: $(cells[8]).text().trim(),
        numberOfBeds: $(cells[9]).text().trim(),
        fullBaths: $(cells[10]).text().trim(),
        halfBaths: $(cells[11]).text().trim(),
        price: $(cells[12]).text().trim().replace(/\/rd/g,''),
        daysOnMarket: $(cells[14]).text().trim()
      };

      homeDetails.description = `${homeDetails.address} ${homeDetails.city}, TN ${homeDetails.zip}`; 

      if (!mlsNumbers.some(mlsNumberObj => mlsNumberObj.mlsNumber === homeDetails.mlsNumber)) {
        if (homeDetails.mlsNumber && homeDetails.mlsNumber.length > 2){
          newHomes.push(homeDetails);
        }
      };
    });

    if (process.env.INITIALIZE !== 'true') {
      await sendSms(newHomes);  
    }
    
    await db.insertHomes(newHomes);
  } catch (error) {
    console.error('error encountered');
    console.error(error);
  }
};


async function sendSms(homes){
  const len = homes.length;

  if (len > 0) {
    const plurality = len < 2 ? 'HOME' : 'HOMES'
    let mainMessage = `${len} NEW ${plurality} LISTED IN 37218!\n`;
    homes.forEach(home => {
      mainMessage += `\n${getFormattedText(home)}`;
    });

    sns.sendSmsToTopic(mainMessage).catch(err => console.error(err));
  }
}

function getFormattedText(rawMessage) {
  const { 
    address, squareFootage, numberOfBeds, realTracsLink,
    fullBaths, halfBaths, price, daysOnMarket,
  } = rawMessage;
  return `Address: ${address}\nSize: ${squareFootage} sqft\nRoom stats: ${numberOfBeds} beds, ${Number(fullBaths) + (Number(halfBaths) * .5)} baths\nPrice: ${price}\nDays on Market: ${daysOnMarket}\nDirect Link: ${realTracsLink}`;
}

async function autoScroll(page){
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      const totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if(totalHeight >= scrollHeight){
            clearInterval(timer);
            resolve();
        }
      }, 100);
    });
  });
}
