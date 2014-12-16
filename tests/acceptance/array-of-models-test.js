import Ember from 'ember';
import startApp from '../helpers/start-app';
import Foo from 'dummy/models/foo';
import { test, moduleFor } from 'ember-qunit';

var App;

module('Acceptance: ArrayOfModels', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting /arrayOfModels', function() {
  visit('/demos/arrayOfModels');

  andThen(function() {
    var arrayModelController = App.__container__.lookup('controller:demos/arrayOfModels');
    equal(currentPath(), 'demos.arrayOfModels');
    ok( arrayModelController.get('model.0') instanceof Foo, 'Controllers model is instance of Foo' );

  });
});
