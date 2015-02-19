import Ember from 'ember';
import startApp from '../helpers/start-app';
import Foo from 'dummy/models/foo';
import { test, moduleFor } from 'ember-qunit';

var App;

module( 'Acceptance: SingleModel', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting /singleModel', function( assert ) {
  visit('/demos/singleModel/1');

  andThen(function() {
    var singleModelController = App.__container__.lookup('controller:demos/singleModel');
    assert.equal(currentPath(), 'demos.singleModel');
    assert.ok( singleModelController.get('model') instanceof Foo, 'Controllers model is instance of Foo' );
  });
});
