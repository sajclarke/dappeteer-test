
import express from 'express'
import puppeteer from 'puppeteer'
import dappeteer from 'dappeteer'

//TODO: Add test-case scenarios using Jest

async function main() {
  const browser = await dappeteer.launch(puppeteer, { headless: false, slowMo: 20, })
  const metamask = await dappeteer.getMetamask(browser)
  
  // import an account
  // Step 1 CHANGE: Add your 12-word mnemonic for an account that already has Kovan ETH
  await metamask.importAccount('Add your 12-word mnemonic here')
  
  // Step 2 CHANGE: Change network as necessary
  await metamask.switchNetwork('kovan')
  
  // go to a dapp and do something that prompts MetaMask to confirm a transaction
  const page = await browser.newPage()

  //TODO: Check for errors
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

  // Step 3 CHANGE: Change url as necessary (can use localhost)
  await page.goto('https://tokenstudio.polymath.network/ticker')
  await page.waitForSelector('#name')
  await page.type('#name', 'SC')
  await page.type('#email', 'shannonajclarke@gmail.com')
  await page.tap('#acceptTerms')
  await page.tap('#acceptPrivacy')
  await page.click('button[type="submit"]')

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

  // Step 4 CHANGE: Change the Ticker Symbol for each test
  await page.type('#ticker', '')
  await page.type('#name', 'ShannonToken')
  await page.click('button[type="submit"]')

  //Click on confirmation modal
  await page.waitFor(2000);
  await page.waitForSelector('.bx--modal-container')
  await page.hover('.bx--btn--primary')
  await page.click('.bx--btn--primary')
  await page.waitFor(2000);
  
  // Gas and Gaslimit configured to ensure successful transaction
  await metamask.confirmTransaction({gas:15, gasLimit:400130})
  await page.bringToFront()
  
  await page.waitForSelector('.confirm-email-form')
  await page.waitFor(2000);
  await page.hover('button[type="submit"]')
  await page.click('button[type="submit"]')

  //This output is not necessary but is helpful for visual confirmation that the test has been completed
  //TODO: Remove this when test case scenarios have been added
  console.log('Test finished')
}

main()
