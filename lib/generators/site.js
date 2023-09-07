const appRoot = require('app-root-path');
const { throwInfo, throwError } = require('../helpers/utils');

var themePack;

try {
  themePack = require(appRoot + '/node_modules/hexo-theme-aurora/package.json');
} catch (error) {
  throwInfo(
    'Aurora Plugin',
    `Aurora Plugin fail to get current Aurora Theme version from package location, trying to get from themes folder instead...`
  );
  try {
    themePack = require(appRoot + '/themes/aurora/package.json');
  } catch (error) {
    throwError(
      'Aurora Plugin Error',
      `Aurora Plugin fail to get current Aurora Theme version, please make sure you have the theme installed.`
    );
    return;
  }
}

class SiteGenerator {
  data = {};

  constructor(configs) {
    configs.theme_config.version = themePack.version;
    this.data = configs;
  }

  addSiteConfig(data) {
    const tempConfigs = this.data;
    // Removed privacy data from site configs
    delete tempConfigs.deploy;
    delete tempConfigs.server;
    tempConfigs.theme_config.algolia = {
      enable: this.data.theme_config.algolia?.enable ?? false
    };
    data.push({
      path: 'api/site.json',
      data: JSON.stringify(tempConfigs)
    });
    return data;
  }
}

module.exports = SiteGenerator;
