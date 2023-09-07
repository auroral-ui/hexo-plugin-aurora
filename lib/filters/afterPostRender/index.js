'use strict';

module.exports = (hexo) => {
  const { filter } = hexo.extend;

  filter.register('after_post_render', require('./quote')(hexo));
};
