const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

const DEFAULT_PAGE_TIMEOUT = 1000 * 60 * 10;
const IDLE_NETWORK_WAIT = 1000 * 10;

exports.getBrowserInstance = async () => {
    const path = await chromium.executablePath()
    const browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: path,
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
    });
    console.log("CREATED NEW BROWSER INSTANCE");
    return browser;
}

exports.monitorNetwork = async (props = {}) => {
    const { url } = props;
    const statsArr = [];
    const browser = await this.getBrowserInstance();
    const page = await browser.newPage();
    let totalBytesUsed = 0;

    page.setDefaultTimeout(DEFAULT_PAGE_TIMEOUT);

    page.on('response', async (response) => {
        const url = response.url();
        let contentLength;

        if (!contentLength) {
            // If content-length is not available, calculate size from buffer
            const buffer = await response.buffer();
            contentLength = buffer.length;
            totalBytesUsed += contentLength;
        }

        statsArr.push({ contentLength, url })
    });

    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForNetworkIdle({ idleTime: IDLE_NETWORK_WAIT });
    await browser.close();
    return { statsArr, totalBytesUsed };
}