import { moduleFor } from 'ember-qunit';
import Ember from 'ember';
module SlModel from 'sl-model';


export default function moduleForSlModel(name, description, callbacks) {

    moduleFor('model:' + name, description, callbacks, function(container, context, defaultSubject) {

        container.register('store:main', SlModel.Store );

        context.__setup_properties__.store = function(){
            return container.lookup('store:main');
        };

        if (context.__setup_properties__.subject === defaultSubject) {
            context.__setup_properties__.subject = function(options) {
                return Ember.run(function() {
                    return container.lookup('store:main').createRecord(name, options);
                });
            };
        }
    });
}
