const puppeteer = require('puppeteer');
const password = require('./config').password;
(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 20
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(1000000);
    await page.setViewport({ width: 1000, height: 600 });
    await page.goto('https://www.facebook.com');
    await page.waitForSelector('#email');
    await page.type('#email', 'oosuide@yahoo.com');
    await page.type('#pass', password);
    await page.click(`[type="submit"]`);
    await page.waitForNavigation();
    await page.click(`div`); // this is because facebook leaves some black overlay if you log in with my chromium; it may not be the same for yours

    await page.waitForSelector(
      `[aria-label="What's on your mind, Osedebamen?"]`
    );
    await page.click(`[aria-label="What's on your mind, Osedebamen?"]`);
    // type inside create post
    let sentenceList = [
      `I will give just about anything if I could make you care, he said. Especially about me.`,

      `This apparent hurly-burly and disorder turn out, after all, to reproduce real life with its fantastic ways more accurately than the most carefully studied out drama of manners. Every man is in himself all humanity, and if he writes what occurs to him he succeeds better than if he copies, with the help of a magnifying glass, objects placed outside of him.`
    ];

    for (let j = 0; j < sentenceList.length; j++) {
      let sentence = sentenceList[j];
      for (let i = 0; i < sentence.length; i++) {
        await page.keyboard.press(sentence[i]);
        if (i === sentence.length - 1) {
          await page.waitFor(2000);
          await page.keyboard.down('Control');
          await page.keyboard.press(String.fromCharCode(13)); // character code for enter is 13
          await page.keyboard.up('Control');
          await page.waitFor(4000);

          console.log('done');
          await page.click(`[aria-label="What's on your mind, Osedebamen?"]`);
        }
      }
    }

    console.log('yay we are in facebook logged in');
  } catch (error) {
    console.error(error);
  }
})();
