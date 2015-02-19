import Ember from 'ember';
import startApp from '../helpers/start-app';
import Foo from 'dummy/models/foo';
import { test, moduleFor } from 'ember-qunit';

var App;

module('Acceptance: ArrayOfModels', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting /arrayOfModels', function( assert ) {
  visit('/demos/arrayOfModels');

  andThen(function() {
    var arrayModelController = App.__container__.lookup('controller:demos/arrayOfModels');
    assert.equal(currentPath(), 'demos.arrayOfModels');
    assert.ok( arrayModelController.get('model.0') instanceof Foo, 'Controllers model is instance of Foo' );

  });
});
