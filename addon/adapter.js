import Ember from 'ember';
import ModelizeMixin from 'sl-modelize/mixins/modelize';

/**
 * SL-Model/adapter
 *
 *
 * @class adapter
 */
export default Ember.Object.extend( ModelizeMixin, {

    /**
     * Run Pre Query Hooks
     * @public
     * @method runPreQueryHooks
     * @param  {object} query an object containing data about the query to be run
     */
    runPreQueryHooks: function( query ){
        this.get( 'container' ).lookup( 'store:main' ).runPreQueryHooks( query );
    },

    /**
     * Run Post Query Hooks
     * @public
     * @method runPostQueryHooks
     * @param  {object} response an object containing the reponse data
     */
    runPostQueryHooks: function( response ){
        this.get( 'container' ).lookup( 'store:main' ).runPostQueryHooks( response );
    },

    /**
     * find place holder function - to be overwritten by child classes
     * @public
     * @method  find
     */
    find: function(){
        Ember.assert( 'Your model should overwrite adapterType', true);
    }
});