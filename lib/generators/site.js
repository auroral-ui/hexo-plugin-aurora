const appRoot = require('app-root-path');
const { throwInfo, throwError } = require('../helpers/utils');
var pack;

try {
  pack = require(appRoot + '/node_modules/hexo-theme-aurora/package.json');
} catch (error) {
  throwInfo(
    'Aurora Site Generator',
    `Aurora Plugin fail to get current Aurora Theme version from package location, trying to get from themes folder instead...`
  );
  try {
    pack = require(appRoot + '/themes/hexo-theme-aurora/package.json');
  } catch (error) {
    throwError(
      'Aurora Site Generator Error',
      `Aurora Plugin fail to get current Aurora Theme version, please make sure you have the theme installed.`
    );
    return;
  }
}

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
