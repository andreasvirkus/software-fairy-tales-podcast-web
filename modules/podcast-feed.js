// Include debug to help with debugging.
const debug = require('debug')('metalsmith-name-of-my-plugin');
const Podcast = require('podcast');

const podcastPlugin = opts => {
  /**
   * Init
   */
  opts = opts || {};

  // Accept string option to specify the hostname
  // if (typeof opts === 'string') {
  //   opts = { hostname: opts };
  // }

  // A mandatory option
  // if (!opts.mandatory) {
  //   throw new Error('"mandatory" option required');
  // }

  // Map options to local variables and set defaults
  const output = opts.output || 'podcast.xml';
  const pattern = opts.pattern || '**/*.html';

  let title = opts.title || ''; // string Title of your site or feed
  let description = opts.description || ''; // optional string A short description of the feed.
  let generator = opts.generator || ''; //  optional string Feed generator.
  let feedUrl = opts.feedUrl || ''; //  url string Url to the rss feed.
  let siteUrl = opts.siteUrl || ''; //  url string Url to the site that the feed is for.
  let imageUrl = opts.imageUrl || ''; //  optional * url string Small image for feed readers to use.
  let docs = opts.docs || ''; //  optional url string Url to documentation on this feed.
  let author = opts.author || ''; //  string Who owns this feed.
  let managingEditor = opts.managingEditor || ''; //  optional string Who manages content in this feed.
  let webMaster = opts.webMaster || ''; //  optional string Who manages feed availability and technical support.
  let copyright = opts.copyright || ''; //  optional string Copyright information for this feed.
  let language = opts.language || ''; //  optional string The language of the content of this feed.
  let categories = opts.categories || ''; //  optional array of strings One or more categories this feed belongs to.
  let pubDate = opts.pubDate || ''; //  optional Date object or date string The publication date for content in the feed
  let ttl = opts.ttl || ''; //  optional integer Number of minutes feed can be cached before refreshing from source.
  let itunesAuthor = opts.itunesAuthor || ''; //  optional string (iTunes specific) author of the podcast
  let itunesSubtitle = opts.itunesSubtitle || ''; //  optional string (iTunes specific) subtitle for iTunes listing
  let itunesSummary = opts.itunesSummary || ''; //  optional string (iTunes specific) summary for iTunes listing
  let itunesOwner = opts.itunesOwner || ''; //  optional object (iTunes specific) owner of the podcast ({ name: String, email: String })
  let itunesExplicit = opts.itunesExplicit || ''; //  optional boolean (iTunes specific) specifies if the podcast contains explicit content
  let itunesCategory = opts.itunesCategory || ''; //  optional array of objects (iTunes specific) Categories for iTunes ([{ text: String, subcats: [{ text: String, subcats: Array }] }])
  let itunesImage = opts.itunesImage || ''; //  optional string (iTunes specific) link to an image for the podcast

  return (files, metalsmith, done) => {

    // Metalsmith metadata usage:
    const metadata = metalsmith.metadata();

    Object.keys(files).forEach(file => {
      // Get the current file's frontmatter
      const frontmatter = files[file];

      // Only process files that pass the check
      if (!check(file, frontmatter)) {
        return;
      }

      // Create the sitemap entry (reject keys with falsy values)
      var entry = pick({});

      // Add the url (which is allowed to be falsy)
      entry.url = buildUrl(file, frontmatter);

      // Add the entry to the sitemap
      sitemap.add(entry);
    });

    // Create sitemap in files
    files[output] = {
      contents: new Buffer(sitemap.toString())
    };

    done();
  };
};

// Expose the plugin
module.exports = podcastPlugin;