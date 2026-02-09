const axios = require('axios');
const cheerio = require('cheerio');

async function inspect() {
    try {
        const { data } = await axios.get('https://www.thehindu.com/');
        const $ = cheerio.load(data);

        console.log('--- H1 (Main Headline) ---');
        $('h1').each((i, el) => {
            console.log($(el).text().trim());
            console.log('Parent classes:', $(el).parent().attr('class'));
            console.log('Link:', $(el).find('a').attr('href'));
        });

        console.log('\n--- H3 (Common Headlines) ---');
        $('h3').slice(0, 5).each((i, el) => { // Limit to 5
            console.log($(el).text().trim());
            console.log('Classes:', $(el).attr('class'));
            console.log('Parent classes:', $(el).parent().attr('class'));
            console.log('Link:', $(el).find('a').attr('href'));
        });

        console.log('\n--- Article Links in specific sections ---');
        // Try to find sections
        const sections = ['div.editorial-section', 'section.politics', '.story-card'];
        sections.forEach(sel => {
            console.log(`Checking selector: ${sel}`);
            console.log('Count:', $(sel).length);
        });

    } catch (err) {
        console.error(err);
    }
}

inspect();
