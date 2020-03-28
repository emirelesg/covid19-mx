const fs = require('fs');
const chrome = require('selenium-webdriver/chrome');
const webdriver = require('selenium-webdriver');
const moment = require('moment');
const path = require('path');

// Paths for the current and previous screenshots.
const baseDir = 'src/assets/screenshots/';
const todayFile = path.join(baseDir, 'covid19.png');
const prevFile = path.join(
  baseDir,
  `covid19-${moment()
    .subtract(1, 'day')
    .format('YYYY-MM-DD')}.png`
);

// Chrome options.
const scale = 2;
const options = new chrome.Options()
  .headless()
  .windowSize({
    width: 1280 * scale,
    height: 739 * scale
  })
  .addArguments('disable-gpu', 'hide-scrollbars');

// Script to adjust the zoom level and scroll to area of interest.
let script = '';
script += `document.body.style.zoom="${Math.round(scale * 100)}%";`;
script += `window.scrollTo(0, ${Math.round(235 * scale)});`;

(async function init() {
  // Create selenium-chrome driver.
  const driver = await new webdriver.Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
  try {
    console.log(`Opening headless chromium...`);
    await driver.get('http://localhost:8080/');
    await driver.wait(webdriver.until.titleIs('COVID-19 en México'), 2000);
    console.log(`Running adjustment script`);
    await driver.executeScript(script);
    console.log(`Taking screenshot`);
    const png = await driver.takeScreenshot();

    // Move current covid19.png image to the prev file.
    if (!fs.existsSync(prevFile)) {
      console.log(`Moving old screenshot -> ${prevFile}`);
      fs.renameSync(todayFile, prevFile);
    }
    console.log(`Writing file -> ${todayFile}`);
    fs.writeFileSync(todayFile, png, 'base64');
  } catch (err) {
    console.error(err);
  } finally {
    await driver.quit();
  }
})();
