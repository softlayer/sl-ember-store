import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
    this.route( 'singleModel', { path: '/singleModel/:model_id' } );
    this.route( 'arrayOfModels', { path: '/arrayOfModels' } ); 
});

export default Router;
