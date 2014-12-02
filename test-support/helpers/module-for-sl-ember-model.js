import { moduleFor } from 'ember-qunit';
import Ember from 'ember';
import SlEmberModelStore from 'sl-ember-store/store';


export default function moduleForSlEmberModel(name, description, callbacks) {

    moduleFor('model:' + name, description, callbacks, function(container, context, defaultSubject) {

        container.register('store:main', SlEmberModelStore );

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
