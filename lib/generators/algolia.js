const striptags = require('striptags');
const algoliasearch = require('algoliasearch');
const { throwWarning, throwInfo, throwError } = require('../helpers/utils');

const FILTER_FUNCTIONS = {
  strip: striptags,
  truncate: function (post, start, end) {
    return post.substr(start, end);
  }
};

class AlgoliaGenerator {
  data = [];
  hexoConfigs = {};
  algoliaConfigs = {
    appId: '',
    adminApiKey: '',
    indexName: '',
    chunkSize: 5000
  };
  fields = [];
  fieldsWithFilters = [];

  constructor(posts, configs) {
    if (!configs.theme_config.algolia?.enable) {
      return;
    }

    const { fields, appId, adminApiKey, indexName, chunkSize } = configs.theme_config.algolia;

    this.data = posts;
    this.configs = configs;
    this.algoliaConfigs = {
      appId,
      adminApiKey,
      indexName,
      chunkSize
    };
    this.fields = this.getBasicFields(fields);
    this.fieldsWithFilters = this.getFieldsWithFilters(fields);
    this.generateAlgolia().then(() => {
      throwInfo('Algolia DONE', `YAY!`);
    });
  }

  async generateAlgolia() {
    this.preparePosts();

    const { appId, adminApiKey, indexName } = this.algoliaConfigs;

    const chunkedPosts = this.splitIntoChunks();
    const algoliaClient = algoliasearch(appId, adminApiKey);
    const algoliaIndex = algoliaClient.initIndex(indexName);

    throwInfo('Algolia INFO', 'Clearing index on Algolia...');
    try {
      await algoliaIndex.clearObjects();
    } catch (error) {
      throwError('Algolia ERR', `Error has occurred during clearing index : ${error}`);
      return;
    }
    throwInfo('Algolia INFO', 'Index cleared.');
    throwInfo('Algolia INFO', 'Indexing posts on Algolia...');

    try {
      await Promise.all(chunkedPosts.map((posts) => algoliaIndex.saveObjects(posts)));
    } catch (error) {
      throwError('Algolia INFO', `Error has occurred during indexing posts : ${error}`);
      return;
    }
    throwInfo('Algolia INFO', `${this.data.length} posts indexed.`);
  }

  /**
   * Get fields without filters
   *
   * @param {Array} fields - A list of fields. E.g: content, excerpt, categories, etc...
   * @returns {Array} - A list of fields without any filters
   */
  getBasicFields(fields) {
    return fields.filter((field) => !/:/.test(field));
  }

  /**
   * Get fields with filters
   *
   * @param {Array} fields - A list of fields. E.g: content, excerpt, categories, etc...
   * @returns {Array} - A list of fields with filters
   */
  getFieldsWithFilters(fields) {
    return fields.filter((field) => /:/.test(field));
  }

  /**
   * Pick specified attributes of a given object
   *
   * @param {Object} object - The object to pick the attribute from
   * @param {Array} attributes - The attributes to pick from the given object
   * @returns {Object}
   */
  pick(object, attributes) {
    const newObject = {};
    attributes.forEach((attribute) => {
      if (object.hasOwnProperty(attribute)) {
        newObject[attribute] = object[attribute];
      }
    });

    return newObject;
  }

  /**
   * Split an `Array` into chunk
   *
   * @param {Array} array - The `Array` to split
   * @param {Number} chunkSize - The size of the chunks
   * @returns {Array}
   */
  splitIntoChunks() {
    const newArrays = this.data.slice(0);
    const chunks = [];
    while (newArrays.length) {
      chunks.push(newArrays.splice(0, this.algoliaConfigs.chunkSize));
    }
    return chunks;
  }

  /**
   * Upper case the first character of a string
   *
   * @param {String} string - The string to update
   * @returns {string}
   */
  upperFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  /**
   * Pick speficied fields of posts
   *
   * @returns {Object} posts - The posts ready to be indexed
   */
  preparePosts() {
    const tagsAndCategoriesFields = ['tag', 'categories'].filter((field) =>
      this.fields.includes(field)
    );

    this.data = this.data.map((initialPost) => {
      const postToIndex = this.pick(initialPost, this.fields);
      // define a unique ID to identfy this post on Algolia
      postToIndex.objectID = initialPost.uid;

      // extract tags and categories
      tagsAndCategoriesFields.forEach((field) => {
        postToIndex[field] = [];
        initialPost[field].data.forEach(function (fieldElement) {
          postToIndex[field].push(fieldElement.name);
        });
      });

      // execute filters of fields
      this.fieldsWithFilters.forEach((field) => {
        const indexedFieldName = [];
        const fieldFilters = field.split(':');
        const fieldName = fieldFilters.shift();

        if (!initialPost.hasOwnProperty(fieldName)) {
          throwWarning('Warn', `"${initialPost.title}" post has no "${fieldName}" field.`);
          return;
        }

        let fieldValue = initialPost[fieldName];

        fieldFilters.forEach(function (filter) {
          const filterArgs = filter.split(',');
          const filterName = filterArgs.shift();

          indexedFieldName.push(filterName.charAt(0).toUpperCase() + filterName.slice(1));
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
}

module.exports = AlgoliaGenerator;
