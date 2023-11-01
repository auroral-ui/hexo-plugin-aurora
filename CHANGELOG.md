## [1.8.4](https://github.com/auroral-ui/hexo-plugin-aurora/compare/v1.8.3...v1.8.4) (2023-11-01)


### Bug Fixes

* category and post generator missing config options ([f3896cc](https://github.com/auroral-ui/hexo-plugin-aurora/commit/f3896ccd0f2c80e115d499f2947f123cd7bad6e6))

## [1.8.3](https://github.com/auroral-ui/hexo-plugin-aurora/compare/v1.8.2...v1.8.3) (2023-09-16)


### Bug Fixes

* code fence lang is undefined cause build fail ([0be169b](https://github.com/auroral-ui/hexo-plugin-aurora/commit/0be169bc24ae4af1e89a6e04edc5be4ee07956c1))

## [1.8.2](https://github.com/auroral-ui/hexo-plugin-aurora/compare/v1.8.1...v1.8.2) (2023-09-13)


### Bug Fixes

* add warning for not configuring site language correctly ([4ad57b7](https://github.com/auroral-ui/hexo-plugin-aurora/commit/4ad57b7097261cacb6c1715a4a4c6425f9d0beca))


### Performance Improvements

* improve performance of shiki progress ([6167806](https://github.com/auroral-ui/hexo-plugin-aurora/commit/6167806aa66319b41f4b70857a95595caa2d895e))

## [1.8.1](https://github.com/auroral-ui/hexo-plugin-aurora/compare/v1.8.0...v1.8.1) (2023-09-12)


### Bug Fixes

* shiki render cause memory leak ([1abb8f0](https://github.com/auroral-ui/hexo-plugin-aurora/commit/1abb8f09f284fc41e873b4c4ce0fc833e384f59c))

# [1.8.0](https://github.com/auroral-ui/hexo-plugin-aurora/compare/v1.7.0...v1.8.0) (2023-09-10)


### Bug Fixes

* gitalk cdn unpkg link ([a9ec8e0](https://github.com/auroral-ui/hexo-plugin-aurora/commit/a9ec8e0b93253f71c3e08ab04b284978c9a96dcd))


### Features

* add algolia search command ([a8ede74](https://github.com/auroral-ui/hexo-plugin-aurora/commit/a8ede7462337893243581991be79bbb22cc44dbc))
* add shiki code highlight engine replacing prism ([dd066a5](https://github.com/auroral-ui/hexo-plugin-aurora/commit/dd066a5c4c8c62ec8e3929103e690561c95588b1))
* change all CDN to use unpkg so it auto use latest minor versions ([ea826cc](https://github.com/auroral-ui/hexo-plugin-aurora/commit/ea826cc12dbaf49adf43db153b0fe4da3fb7f269))

# [1.7.0](https://github.com/auroral-ui/hexo-plugin-aurora/compare/v1.6.0...v1.7.0) (2023-08-18)


### Features

* add feature to use uid as slug ([d5607b2](https://github.com/auroral-ui/hexo-plugin-aurora/commit/d5607b261dcb5561b4def28035da488555db82a6))
* now sort tags in decending order ([b08c750](https://github.com/auroral-ui/hexo-plugin-aurora/commit/b08c750dafff3df498c721731634eb2808d55fb2))

# [1.6.0](https://github.com/auroral-ui/hexo-plugin-aurora/compare/v1.5.0...v1.6.0) (2023-08-15)


### Features

* add hidden post feature ([b9ead53](https://github.com/auroral-ui/hexo-plugin-aurora/commit/b9ead535d1c12ce01171d062a990fb37f883c464))
* add new achieves API with pagination ([e60e62d](https://github.com/auroral-ui/hexo-plugin-aurora/commit/e60e62dcdfebf41c9f210e5a1702173506a882b9))

# [1.5.0](https://github.com/auroral-ui/hexo-plugin-aurora/compare/v1.4.2...v1.5.0) (2023-08-11)


### Features

* changed default post abstract length to 80 ([b2575b0](https://github.com/auroral-ui/hexo-plugin-aurora/commit/b2575b00d179a295bee24b4e9fb0b9fda106010a))

## [1.4.2](https://github.com/auroral-ui/hexo-plugin-aurora/compare/v1.4.1...v1.4.2) (2023-08-10)


### Bug Fixes

* removed privacy data from site config ([d26e57a](https://github.com/auroral-ui/hexo-plugin-aurora/commit/d26e57a4edf11d8b7666c94f42b9ae294b52a517))

## [1.4.1](https://github.com/auroral-ui/hexo-plugin-aurora/compare/v1.4.0...v1.4.1) (2023-08-09)


### Bug Fixes

* fix links page index.html not being generated ([eaaa4ea](https://github.com/auroral-ui/hexo-plugin-aurora/commit/eaaa4ea5d724092c8d07bfb868abeb01467bb7a1))

# [1.4.0](https://github.com/auroral-ui/hexo-plugin-aurora/compare/v1.3.3...v1.4.0) (2023-08-09)


### Features

* add friends link generator ([4a07ab0](https://github.com/auroral-ui/hexo-plugin-aurora/commit/4a07ab0b0ba001bd1d6b0cd2bf90bc44a080483f))

## [1.3.3](https://github.com/auroral-ui/hexo-plugin-aurora/compare/v1.3.2...v1.3.3) (2023-08-04)


### Bug Fixes

* package version reading path for themes folder ([91d510e](https://github.com/auroral-ui/hexo-plugin-aurora/commit/91d510ed9c6f29ca877a57eb59692360e9712575))

## [1.3.2](https://github.com/auroral-ui/hexo-plugin-aurora/compare/v1.3.1...v1.3.2) (2023-08-04)


### Bug Fixes

* dynamic pack version require for the plugin ([9021007](https://github.com/auroral-ui/hexo-plugin-aurora/commit/90210076cc14bc68c10845b903d632eea30f86ba))

## [1.3.1](https://github.com/auroral-ui/hexo-plugin-aurora/compare/v1.3.0...v1.3.1) (2023-08-03)


### Bug Fixes

* add site.language missing error console ([342c969](https://github.com/auroral-ui/hexo-plugin-aurora/commit/342c96971922b4e9804e2eee36ee7c294e1460c3))
* plugin fails if some comment plugin is not configured ([32a1c02](https://github.com/auroral-ui/hexo-plugin-aurora/commit/32a1c0231c60a6d05707869fc8c9560356079233))
* version now fetch from package fallback to theme folder ([63aeda1](https://github.com/auroral-ui/hexo-plugin-aurora/commit/63aeda182868c4746a5d1a26a965cca25ee56f58))

# [1.3.0](https://github.com/auroral-ui/hexo-plugin-aurora/compare/v1.2.0...v1.3.0) (2023-08-02)


### Bug Fixes

* generation fail with no tags [#1](https://github.com/auroral-ui/hexo-plugin-aurora/issues/1) ([3b17b95](https://github.com/auroral-ui/hexo-plugin-aurora/commit/3b17b9534ae40c1358e6d2f88a8fa3c895a5cc11))


### Features

* add twikoo and waline scripts ([097603a](https://github.com/auroral-ui/hexo-plugin-aurora/commit/097603ac16299cc8ebc0cc99b6b8c6ddada27c3b))

# [1.2.0](https://github.com/auroral-ui/hexo-plugin-aurora/compare/v1.1.1...v1.2.0) (2023-07-25)


### Bug Fixes

* add back leancloud script and fixed valine script ([2d53a5f](https://github.com/auroral-ui/hexo-plugin-aurora/commit/2d53a5fb4106db89e6b50f2c50535f9c3873b8ea))
* missing truncate-html package dependencies ([44f7f50](https://github.com/auroral-ui/hexo-plugin-aurora/commit/44f7f50872c1301133697dd483a4b83b3efe3df7))


### Features

* updated all cdn packages to latest version ([5055c52](https://github.com/auroral-ui/hexo-plugin-aurora/commit/5055c5251f79fbb33da9aa2ab5b2a6b0d72b2e1f))

## [1.1.1](https://github.com/auroral-ui/hexo-plugin-aurora/compare/v1.1.0...v1.1.1) (2023-07-19)


### Bug Fixes

* abstracts not generated correctly ([656ab3b](https://github.com/auroral-ui/hexo-plugin-aurora/commit/656ab3be21eff4141eef0e2a7acc90047a28a08d))

# [1.1.0](https://github.com/auroral-ui/hexo-plugin-aurora/compare/v1.0.2...v1.1.0) (2023-07-18)


### Features

* add custom abstracts meta feature support ([83af58e](https://github.com/auroral-ui/hexo-plugin-aurora/commit/83af58e6d7458538a824f37e13f1b35d4540b606))

## [1.0.2](https://github.com/auroral-ui/hexo-plugin-aurora/compare/v1.0.1...v1.0.2) (2023-07-17)


### Bug Fixes

* multiple author not generated correctly ([521c671](https://github.com/auroral-ui/hexo-plugin-aurora/commit/521c671cc89ff5e9f90170e76833fdc6b28bc58f))

## [1.0.1](https://github.com/auroral-ui/hexo-plugin-aurora/compare/v1.0.0...v1.0.1) (2023-07-02)


### Bug Fixes

* removed unccessary files publishing to npm ([2637c38](https://github.com/auroral-ui/hexo-plugin-aurora/commit/2637c3824e680ab20c5135833f2a2670f7d0b085))

# 1.0.0 (2023-07-02)


### Bug Fixes

* release action fail ([428b04c](https://github.com/auroral-ui/hexo-plugin-aurora/commit/428b04cc3401e23d1527d1e10c83071aa307d430))
* semantic release not found ([5674a87](https://github.com/auroral-ui/hexo-plugin-aurora/commit/5674a87f42c06fdd841438252ba1a8262bc357f2))


### Features

* separate all the aurora scripts into a plugin package ([084f113](https://github.com/auroral-ui/hexo-plugin-aurora/commit/084f1133987d33ac58df6a2c3aa57a8a9de1753d))
