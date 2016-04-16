Package.describe({
  name: 'ronenm:autoform-reference-typeahead',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');
  api.use('ecmascript');
  api.use([
    'blaze',
    'spacebars',
    'templating',
    'minimongo'
  ], 'client');
  api.use('aldeed:template-extension@3.4.0');
  api.use('aldeed:autoform@5.6.0');
  api.use('sergeyt:typeahead@0.11.0');
  api.use('underscore');
  api.addFiles('templates.html','client');
  api.addFiles('autoform-reference-typeahead.js','client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('ronenm:autoform-reference-typeahead');
  api.addFiles('autoform-reference-typeahead-tests.js');
});
