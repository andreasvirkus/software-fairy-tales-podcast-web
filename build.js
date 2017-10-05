const metalsmith = require('metalsmith');
const drafts = require('metalsmith-drafts');
const markdown = require('metalsmith-markdown');
const collections = require('metalsmith-collections');
const permalinks = require('metalsmith-permalinks');
const layouts = require('metalsmith-layouts');
const sitemap = require('metalsmith-sitemap');
const podcast = require('metalsmith-podcast');
const Handlebars = require('handlebars');
const moment = require('moment');

// Date for when the podcast feed was last updated
const date = new Date();
const day = date.getDate();
const month = date.getMonth() + 1;
const year = date.getFullYear();
const podcastFeedDate = `${month}/${day}/${year}`;

Handlebars.registerHelper('is', function (value, test, options) {
    if (value === test) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper('date', function (date) {
    return moment(date, 'MM-DD-YYYY').format('Do MMM \'YY');
});

metalsmith(__dirname)
    .metadata({
        site: {
            name: 'Hea Tarkvara ja Teised Muinasjutud',
            description: 'Tore podcast veebile südamelähedastel teemadel.',
            generatorname: 'Metalsmith',
            generatorurl: 'http://metalsmith.io/',
            generatortitle: 'Check out Metalsmith!',
            hostname: 'Netlify',
            hosturl: 'https://netlify.com/',
            hosttitle: 'Learn more about Netlify'
        }
    })
    .source('./src')
    .destination('./dist')
    .clean(true)
    .use(drafts())
    .use(collections({
        posts: {
            pattern: 'podcasts/*.md',
            sortBy: 'date',
            reverse: true
        },
        pages: {
            pattern: '*.md',
            sortBy: 'menu-order'
        }
    }))
    .use(markdown())
    .use(permalinks())
    .use(layouts({
        engine: 'handlebars',
        directory: 'layouts',
        default: 'default.hbs',
        partials: 'layouts/partials'
    }))
    .use(podcast({
        title: 'Hea Tarkvara ja Teised Muinasjutud',
        description: 'A podcast about everything web and dev related.',
        feedUrl: 'https://dowdy-elf.netlify.com/podcast.xml',
        siteUrl: 'https://dowdy-elf.netlify.com',
        imageUrl: 'https://dowdy-elf.netlify.com/assets/img/podcast-image.jpg',
        author: 'Nele Sergejeva, Karmen Kukk, Ando Roots, Jaan Pullerits',
        managingEditor: 'Ando Roots',
        webMaster: 'Andreas Virkus',
        language: 'EE-ET',
        categories: ['web', 'dev'],
        pattern: 'podcasts/*/*.html',
        pubDate: podcastFeedDate,
        ttl: 1
    }))
    .use(sitemap({
        hostname: 'https://dowdy-elf.netlify.com'
    }))
    .build(function (err) {
        if (err) throw err;
    });
