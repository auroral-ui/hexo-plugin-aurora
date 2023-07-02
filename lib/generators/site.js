const appRoot = require('app-root-path');
const pack = require(appRoot + '/node_modules/hexo-theme-aurora/package.json');

class SiteGenerator {
  data = {};

  constructor(configs) {
    configs.theme_config.version = pack.version;
    this.data = configs;
  }

  addSiteConfig(data) {
    const configs = this.data;
    data.push({
      path: 'api/site.json',
      data: JSON.stringify(configs)
    });
    return data;
  }
}

module.exports = SiteGenerator;
