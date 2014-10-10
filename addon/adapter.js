import Ember from 'ember';
import ModelizeMixin from 'sl-modelize/mixins/modelize';

/** @module SL-Model/adapter */
export default Ember.Object.extend( ModelizeMixin, {

    /**
     * Run Pre Query Hooks
     *
     * @public
     * @function runPreQueryHooks
     * @argument {object} query an object containing data about the query to be run
     * @return   { void}
     */
    runPreQueryHooks: function( query ) {
        this.get( 'container' ).lookup( 'store:main' ).runPreQueryHooks( query );
    },

    /**
     * Run Post Query Hooks
     *
     * @public
     * @function runPostQueryHooks
     * @argument {object} response an object containing the reponse data
     * @return   { void}
     */
    runPostQueryHooks: function( response ){
        this.get( 'container' ).lookup( 'store:main' ).runPostQueryHooks( response );
    },

    /**
     * Placeholder function for find() to be overwritten by child classes
     *
     * @public
     * @function find
     * @throws {Ember.assert}
     * @return   {void}
     */
    find: function() {
        Ember.assert( 'Your model should overwrite adapterType', true );
    }
});