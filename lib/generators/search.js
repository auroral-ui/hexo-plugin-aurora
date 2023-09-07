const { searchMapper } = require('../helpers/mapper');

class SearchGenerator {
  data = [];
  configs = {};

  constructor(posts, configs) {
    this.data = configs.theme_config.algolia?.enable ? [] : posts.map((post) => searchMapper(post));
  }

  addSearchIndex(data) {
    if (this.data.length <= 0) return data;
    data.push({
      path: 'api/search.json',
      data: JSON.stringify(this.data)
    });
    return data;
  }
}

module.exports = SearchGenerator;
