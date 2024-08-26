const { app } = require('@azure/functions');
const { getBrowserInstance } = require('../utils/puppeter');

app.http('httpTrigger1', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);
        const {url} = request.params || {};

        const browser = await getBrowserInstance();
        const page = await browser.newPage();

        // Navigate the page to a URL
        await page.goto(url);

        console.log("WENT TO PAGE ");
        
        // Set screen size
        await page.setViewport({width: 1080, height: 1024});
        console.log("DID VIEW PORT");

        const data = await page.evaluate(() => document.querySelector('*').outerHTML);

        await browser.close();


        const name = request.query.get('name') || await request.text() || 'world';

        return { body: data };
    }
});
