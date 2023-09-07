const striptags = require('striptags');
const algoliasearch = require('algoliasearch');
const PostGenerator = require('../generators/post');

const FILTER_FUNCTIONS = {
  strip: striptags,
  truncate: function (post, start, end) {
    return post.substr(start, end);
  }
};

/**
 * Pick specified attributes of a given object
 *
 * @param {Object} object - The object to pick the attribute from
 * @param {Array} attributes - The attributes to pick from the given object
 * @returns {Object}
 */
function pick(object, attributes) {
  const newObject = {};
  attributes.forEach((attribute) => {
    if (object.hasOwnProperty(attribute)) {
      newObject[attribute] = object[attribute];
    }
  });

  return newObject;
}

/**
 * Upper case the first character of a string
 *
 * @param {String} string - The string to update
 * @returns {string}
 */
function upperFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Split an `Array` into chunk
 *
 * @param {Array} array - The `Array` to split
 * @param {Number} chunkSize - The size of the chunks
 * @returns {Array}
 */
function splitIntoChunks(array, chunkSize) {
  const newArrays = array.slice(0);
  const chunks = [];
  while (newArrays.length) {
    chunks.push(newArrays.splice(0, chunkSize));
  }
  return chunks;
}

/**
 * Pick speficied fields of posts
 *
 * @param {Object} posts - The posts to prepare
 * @param {Array} fields - The fields of the posts to select
 * @param {Array} fieldsWithFilters - The fields of the posts to select
 * @returns {Object} posts - The posts ready to be indexed
 */
function preparePosts(posts, fields, fieldsWithFilters) {
  const tagsAndCategoriesFields = ['tags', 'categories'].filter((field) => fields.includes(field));

  return posts.map((initialPost) => {
    const postToIndex = pick(initialPost, fields);
    // define a unique ID to identfy this post on Algolia
    postToIndex.objectID = initialPost.uid;

    // extract tags and categories
    tagsAndCategoriesFields.forEach((field) => {
      postToIndex[field] = [];
      initialPost[field].forEach(function (fieldElement) {
        postToIndex[field].push(fieldElement.name);
      });
    });

    // execute filters of fields
    fieldsWithFilters.forEach((field) => {
      const indexedFieldName = [];
      const fieldFilters = field.split(':');
      const fieldName = fieldFilters.shift();

      if (!initialPost.hasOwnProperty(fieldName)) {
        hexo.log.warn(`"${initialPost.title}" post has no "${fieldName}" field.`);
        return;
      }

      let fieldValue = initialPost[fieldName];

      fieldFilters.forEach(function (filter) {
        const filterArgs = filter.split(',');
        const filterName = filterArgs.shift();

        indexedFieldName.push(upperFirst(filterName));
        filterArgs.unshift(fieldValue);
        // execute filter on field value
        fieldValue = FILTER_FUNCTIONS[filterName].apply(this, filterArgs);
      });

      // store filter result in post object
      postToIndex[fieldName + indexedFieldName.join('')] = fieldValue;
    });

    return postToIndex;
  });
}

/**
 * Get fields without filters
 *
 * @param {Array} fields - A list of fields. E.g: content, excerpt, categories, etc...
 * @returns {Array} - A list of fields without any filters
 */
function getBasicFields(fields) {
  return fields.filter((field) => !/:/.test(field));
}

/**
 * Get fields with filters
 *
 * @param {Array} fields - A list of fields. E.g: content, excerpt, categories, etc...
 * @returns {Array} - A list of fields with filters
 */
function getFieldsWithFilters(fields) {
  return fields.filter((field) => /:/.test(field));
}

async function algoliaCommand(hexo, args, callback) {
  const algoliaConfig = hexo.config.theme_config.algolia;
  const fields = getBasicFields(algoliaConfig.fields);
  const fieldsWithFilters = getFieldsWithFilters(algoliaConfig.fields);
  const algoliaAppId = process.env.ALGOLIA_APP_ID || algoliaConfig.appId;
  const algoliaAdminApiKey = process.env.ALGOLIA_ADMIN_API_KEY || algoliaConfig.adminApiKey;
  const algoliaIndexName = process.env.ALGOLIA_INDEX_NAME || algoliaConfig.indexName;
  // Algolia recommendation: split posts into chunks of 5000 to get a good indexing/insert performance
  const algoliaChunkSize = algoliaConfig.chunkSize || 5000;

  await hexo.call('generate');
  await hexo.database.load();

  let originalPosts = hexo.database
    .model('Post')
    .find({ published: true })
    .sort('date', 'asc')
    .toArray();

  let postClass = new PostGenerator({ data: originalPosts }, hexo.config, { sort: false });
  let posts = postClass.data;

  if (!posts.length) {
    hexo.log.info('There is no post to index.');
    return callback();
  }
  posts = preparePosts(posts, fields, fieldsWithFilters);

  const chunkedPosts = splitIntoChunks(posts, algoliaChunkSize);
  const algoliaClient = algoliasearch(algoliaAppId, algoliaAdminApiKey);
  const algoliaIndex = algoliaClient.initIndex(algoliaIndexName);

  if (args && !args.n) {
    hexo.log.info('Clearing index on Algolia...');
    try {
      await algoliaIndex.clearObjects();
    } catch (error) {
      hexo.log.info(`Error has occurred during clearing index : ${error}`);
      return callback(error);
    }
    hexo.log.info('Index cleared.');
  }

  hexo.log.info('Indexing posts on Algolia...');
  try {
    await Promise.all(chunkedPosts.map((posts) => algoliaIndex.saveObjects(posts)));
  } catch (error) {
    hexo.log.info(`Error has occurred during indexing posts : ${error}`);
    return callback(error);
  }
  hexo.log.info(`${posts.length} posts indexed.`);
}

module.exports = algoliaCommand;
