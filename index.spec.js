
// import express from 'express'
// import puppeteer from 'puppeteer'
// import dappeteer from 'dappeteer'

const puppeteer = require('puppeteer')
const dappeteer = require('dappeteer')

const isDebugging = () => {
  const debugging_mode = {
    headless: true,
    slowMo: 2,
    devtools: true,
  }
  return process.env.NODE_ENV === 'development' ? debugging_mode : {}
}

let browser
let metamask
let page

beforeAll(async () => {
  // browser = await puppeteer.launch()
  // page = await browser.newPage()

  jest.setTimeout(30000)

  browser = await dappeteer.launch(puppeteer, isDebugging())
  metamask = await dappeteer.getMetamask(browser)

  // import an account
  // Step 1 CHANGE: Add your 12-word mnemonic for an account that already has Kovan ETH
  await metamask.importAccount('census enact air time view resource resource same romance sheriff ten section')

  // Step 2 CHANGE: Change network as necessary
  await metamask.switchNetwork('kovan')

  // metamask.close()

  page = await browser.newPage()
  // await page.goto('https://tokenstudio.polymath.network')
})

describe('on page load', () => {
  test(
    'page loads',
    async () => {
      // jest.setTimeout(30000)

      // await page.waitForSelector('.pui-h0')
      // const html = await page.$eval('.pui-h1', (e) => e.innerHTML)
      // expect(html).toBe('Create Your Account')
      // browser.close()
      await page.goto('https://tokenstudio.polymath.network')
    }, // This is not new
    30000,
  ) // this is not new

})

describe('sign transaction', () => {
  test('sign metamask', async () => {
    // jest.setTimeout(30000)

    await page.goto('https://tokenstudio.polymath.network/ticker')
    // page.reload()
    await page.waitFor(2000);
    // await metamask.confirmTransaction()
    // metamask.bringToFront()

    // Sign transaction
    const EXTENSION_ID = 'nkbihfbeogaeaoehlefnkodbefgpgknn'
    const EXTENSION_URL = `chrome-extension://${EXTENSION_ID}/popup.html`

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
  })


})

describe('login form', () => {
  test('should display login page', async () => {
    await page.waitForSelector('.pui-h1')
    // const text = await page.evaluate(() => document.body.innerText)
    // expect(text).toContain('Create Your Account')
    const html = await page.$eval('.pui-h1', (e) => e.innerHTML)
    expect(html).toBe('Create Your Account')
    // done() //here
  })

  test('should show error message if email is not correct', async () => {
    await page.waitForSelector('#name')
    await page.type('#name', 'user')
    await page.type('#email', 'user')
    await page.tap('#acceptTerms')
    await page.tap('#acceptPrivacy')
    await page.click('button[type=submit]')

    try {
      await page.waitForSelector('#email-error-msg')
      // you need to try catch the error with async await
      await page.evaluate(
        () => document.getElementById('#email-error-msg')[0], // no need for async
      )
    } catch (errorMessage) {
      console.log('errorMessage', errorMessage)
    }

    // you lack the expectation in the test
    // expect(true).toBe(true)
  })

  test(
    'login form works correctly',
    async () => {
      // const firstNameEl = await page.$('[data-testid="firstName"]')
      // const lastNameEl = await page.$('[data-testid="lastName"]')
      // const emailEl = await page.$('[data-testid="email"]')
      // const passwordEl = await page.$('[data-testid="password"]')
      // const submitEl = await page.$('[data-testid="submit"]')

      // await firstNameEl.tap()
      // await page.type('[data-testid="firstName"]', user.firstName)

      // await lastNameEl.tap()
      // await page.type('[data-testid="lastName"]', user.lastName)

      // await emailEl.tap()
      // await page.type('[data-testid="email"]', user.email)

      // await passwordEl.tap()
      // await page.type('[data-testid="password"]', user.password)

      // await submitEl.tap()

      // await page.waitForSelector('[data-testid="success"]')
      await page.waitForSelector('#name')
      await page.type('#name', 'SC')
      await page.type('#email', 'shannonajclarke@gmail.com')
      await page.tap('#acceptTerms')
      await page.tap('#acceptPrivacy')
      await page.click('button[type="submit"]')
    },
    1600000,
  )
  // test('sets firstName cookie', async () => {
  //   const cookies = await page.cookies()
  //   const firstNameCookie = cookies.find((c) => c.name === 'firstName' && c.value === user.firstName)

  //   expect(firstNameCookie).not.toBeUndefined()
  // })

  afterAll(async () => {
    await browser.close()
  })
})



