const axios = require('axios');
const cheerio = require('cheerio');

async function inspect(url, name) {
    try {
        console.log(`\n\n--- INSPECTING: ${name} (${url}) ---`);
        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const $ = cheerio.load(data);

        console.log('--- H1 ---');
        $('h1').each((i, el) => {
            console.log('Text:', $(el).text().trim());
            console.log('Link:', $(el).find('a').attr('href'));
            console.log('Parent Class:', $(el).parent().attr('class'));
        });

        console.log('--- H2 (sample) ---');
        $('h2').slice(0, 3).each((i, el) => {
            console.log('Text:', $(el).text().trim());
            console.log('Link:', $(el).find('a').attr('href'));
        });

        // Check specific known classes or attributes
        if (name === 'ET') {
            console.log('Checking .story-title:', $('.story-title').length);
        }
        if (name === 'IE') {
            console.log('Checking .title:', $('.title').length);
            console.log('Checking .heading:', $('.heading').length);
        }

    } catch (err) {
        console.error(`Error fetching ${name}:`, err.message);
    }
}

async function run() {
    await inspect('https://economictimes.indiatimes.com/', 'ET');
    await inspect('https://indianexpress.com/', 'IE');
}

run();
