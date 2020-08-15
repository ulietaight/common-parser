import cherio from 'cherio';
import chalk from 'chalk';
import { PuppeteerHandler } from './helpers/puppeteer';
import saveData from './handlers/saver';
const SITE = 'http://oto-register.autoins.ru/oto/';
export const p = new PuppeteerHandler();

(function main() {
  parse(SITE)
})();

async function parse(url) {
  try {
    const pageContent = await p.getPageContent(url);

    const $ = cherio.load(pageContent);
    const items = [];
    $('tbody > tr').each((i, td) => {

      if ($(td).is('[data-expanded=true]')) {
        let item = {}
        $(td).children().each((index, tr) => {
          switch(index) {
            case 0:
              item.status = tr.children[0].children[0].attribs.title
              break;
            case 1:
              item.number = tr.children[0].children[0].data
              break;
            case 2:
              item.name = tr.children[0].children[0].children[0].data
              break;
            case 3:
              item.address = tr.children[0].children[0].data
              break;
            case 4:
              item.phone = tr.children[0].children[0].data
              break;
          }
        })
        items.push(item);
      }  

    });

    await saveData({
      items,
    });
 
  } catch (err) {
    console.log(chalk.red('An error has occured \n'));
    console.log(err);
  }
}
