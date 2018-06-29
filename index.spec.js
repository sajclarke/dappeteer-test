'use strict';

const puppeteer = require('puppeteer')
const dappeteer = require('dappeteer')
var path = require('path')
var nodemailer = require('nodemailer')
var mg = require('nodemailer-mailgun-transport')
// const ABSPATH = path.dirname(process.mainModule.filename)

var auth = {
  auth: {
    api_key: 'key-d3ff66e5968f8ef79bc95bd5d2c6e3fb',
    domain: 'carepoint.co',
  },
}

var nodemailerMailgun = nodemailer.createTransport(mg(auth))

const isDebugging = () => {
  const debugging_mode = {
    headless: true,
    slowMo: 2
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


describe('signup page', () => {

  test('sign metamask transaction', async () => {
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

  test('should display signup page', async () => {
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
    // await page.tap('#acceptTerms')
    // await page.tap('#acceptPrivacy')
    await page.tap('#name')
    // await page.tap('button[type=submit]')

    try {
      await page.waitForSelector('#email-error-msg')
      // you need to try catch the error with async await
      await page.evaluate(
        () => document.getElementById('#email-error-msg'), // no need for async
      )
    } catch (errorMessage) {
      console.log('errorMessage', errorMessage)
    }

    // you lack the expectation in the test
    // expect(true).toBe(true)
  })

  test(
    'signup form works correctly',
    async () => {
      await page.waitFor(2000);
      await page.waitForSelector('#name')
      await page.type('#name', 'SC')
      await page.type('#email', 'shannonajclarke@gmail.com')
      await page.tap('#acceptTerms')
      await page.tap('#acceptPrivacy')
      await page.click('button[type="submit"]')
    },
    1600000,
  )



})

describe('ticker reservation page', () => {

  test('fill out ticker reservation', async () => {
    // jest.setTimeout(30000)

    // await page.bringToFront()
    await page.waitForSelector('#ticker')
    await page.type('#ticker', 'MCCLEAN03')
    await page.type('#name', 'ShannonToken')
    await page.hover('button[type="submit"]')
    await page.click('button[type="submit"]')


  })


  afterAll(async () => {
    await browser.close()
  })

})

describe('finalize', () => {

  test('send report results', async () => {


    const recipient = 'shannonjamalclarke@gmail.com';

    nodemailerMailgun.sendMail(
      {
        from: 'shannon@carepoint.co',
        to: recipient, // An array if you have multiple recipients.
        // cc: 'second@domain.com',
        // bcc: 'secretagent@company.gov',
        subject: 'Polymath-Issuer Test results',
        // 'h:Reply-To': 'loyalvisitorsclub@visitbarbados.org',
        //You can use "html:" to send HTML email content. It's magic!
        html: 'See attachment',
        attachments: [
          {
            path: __dirname + `/test-report.html`,
          },
        ],
        //You can use "text:" to send plain-text content. It's oldschool!
        // text: "Mailgun rocks, pow pow!"
      },
      function (err, info) {
        if (err) {
          console.log('Error: ' + err)
        } else {
          console.log('Results sent to ' + recipient)
        }
      },
    )
  })
})



