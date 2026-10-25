// Prima: npm run serve. Usa il renderer e i selettori della galleria senza modificarne il DOM.
const {chromium} = require('playwright');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({headless: true});
  try {
    const page = await browser.newPage({viewport: {width: 1440, height: 1000}, reducedMotion: 'reduce'});
    await page.goto('http://127.0.0.1:4173/bottega/galleria.html');
    await page.waitForFunction(() => window.__galleria?.pronto);
    await page.selectOption('#tema', 'laika');
    await page.locator('[data-tab=figure]').click();
    for (const variante of ['marinaio', 'soldato_guarnigione', 'soldatessa', 'uomo_cappello']) {
      await page.selectOption('#variante', variante);
      await page.selectOption('#ruolo', variante.startsWith('soldat') ? 'esercito' : 'popolo');
      await page.screenshot({path: path.join(__dirname, 'galleria-' + variante + '.png'), fullPage: true});
    }
    await page.locator('[data-tab=scene]').click();
    await page.selectOption('#scena', 'esempio-varianti');
    await page.locator('#skip').click();
    await page.screenshot({path: path.join(__dirname, 'scena-varianti.png'), fullPage: true});
  } finally {
    await browser.close();
  }
})().catch(e => {console.error(e); process.exitCode = 1;});
