const assert = require('node:assert/strict');
const path = require('node:path');

module.exports = async function checkLaikaGallery(browser, root, artifacts) {
  for (const width of [390, 1280]) {
    const context = await browser.newContext({viewport: {width, height: 850}, hasTouch: width === 390});
    const page = await context.newPage(), errors = [];
    page.on('pageerror', err => errors.push(err.message));
    await page.goto('http://127.0.0.1:4173/prototypes/laika-kit/');
    await page.waitForFunction(() => document.querySelector('#status')?.textContent.includes('Verificati con composePack'));
    assert.equal(await page.locator('.asset').count(), 14, 'Catalogo dei simboli incompleto');
    assert.equal(await page.locator('#scene-buttons button').count(), 4, 'Composizioni incomplete');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2), true, 'Overflow orizzontale su ' + width);
    await page.locator('[data-stage="scena-mir"]').click();
    assert.equal(await page.locator('[data-layer="assemblea"]').count(), 1);
    await page.locator('#play').click();
    await page.waitForTimeout(150);
    assert.equal(await page.locator('#stage').getAttribute('data-motion'), 'playing');
    await page.locator('#pause').click();
    assert.equal(await page.locator('#stage').getAttribute('data-motion'), 'paused');
    await page.locator('#pause').click();
    await page.locator('#skip').click();
    assert.equal(await page.locator('#stage').getAttribute('data-motion'), 'finished');
    await page.locator('[data-stage="scena-pane"]').click();
    await page.screenshot({path: path.join(artifacts, 'laika-atto0-' + width + '.png'), fullPage: true});
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.locator('#play').click();
    assert.equal(await page.locator('#stage').getAttribute('data-motion'), 'finished');
    assert.deepEqual(errors, []);
    await context.close();
  }
  console.log('LAIKA PASS: 14 simboli, 4 scene, viewport 390/1280, playback, pausa, skip, reduced-motion');
};
