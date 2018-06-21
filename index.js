
import express from 'express'
import puppeteer from 'puppeteer'
import dappeteer from 'dappeteer'

async function main() {
  const browser = await dappeteer.launch(puppeteer, { headless: false, slowMo: 20, })
  const metamask = await dappeteer.getMetamask(browser)
  
  // create or import an account
  // await metamask.createAccount()
  await metamask.importAccount('census enact air time view resource resource same romance sheriff ten section')
  
  // you can change the network if you want
  await metamask.switchNetwork('kovan')
  
  // go to a dapp and do something that prompts MetaMask to confirm a transaction
  const page = await browser.newPage()

  //Check for errors
  page.on('error', (err) => {
    console.log('error: ', err)
  })
  page.on('pageerror', (err) => {
    console.log('pageerror: ', err)
  })
  page.on('console', msg => {
    for (let i = 0; i < msg.args.length; ++i)
      console.log(`${i}: ${msg.args[i]}`)
  })

  await page.goto('https://tokenstudio.polymath.network/ticker')
  await page.waitForSelector('#name')
  await page.type('#name', 'SC')
  await page.type('#email', 'shannonajclarke@gmail.com')
  
  // const inputElement = await page.$('input[type=checkbox]');
  // await inputElement.check();
  // await page.click('#acceptTerms')

  // await page.focus('input[type="checkbox"]')
  // await page.focus('input[type=checkbox]')
  // await page.focus('.bx--checkbox')
  await page.tap('#acceptTerms')
  await page.tap('#acceptPrivacy')

  
  await page.click('button[type="submit"]')
  // await page.waitForNavigation()
  // let options=[]
  
  //Sign transaction
  const EXTENSION_ID ='nkbihfbeogaeaoehlefnkodbefgpgknn'
  const EXTENSION_URL =`chrome-extension://${EXTENSION_ID}/popup.html`

  const metamaskPage = await browser.newPage()
  await metamaskPage.goto(EXTENSION_URL)
  await metamaskPage.waitForSelector('.identity-panel')


  const linkHandlers = await metamaskPage.$x("//button[contains(text(), 'Sign')]");
  if (linkHandlers.length > 0) {
    await linkHandlers[0].click();
  } else {
    throw new Error("Link not found");
  }

  metamaskPage.close()

  //Fill out ticker reservation form
  await page.bringToFront()
  await page.waitForSelector('#ticker')
  await page.type('#ticker', 'SHA9')
  await page.type('#name', 'ShannonToken')
  await page.click('button[type="submit"]')

  //Click on confirmation modal
  await page.waitFor(2000);
  await page.waitForSelector('.bx--modal-container')
  await page.hover('.bx--btn--primary')
  await page.click('.bx--btn--primary')
  // const modal = page.$('.bx--modal-container')
  // modal.bringToFront()
  // await page.focus('.bx--modal-container')
  await page.waitFor(2000);
  
  await metamask.confirmTransaction({gas:15, gasLimit:400130})
  // const acceptButton2 = await metamask.$('button')
  // await acceptButton2.click()
  await page.bringToFront()
  
  await page.waitForSelector('.confirm-email-form')
  await page.waitFor(2000);
  await page.hover('button[type="submit"]')
  await page.click('button[type="submit"]')

  console.log('finished')
}

main()
