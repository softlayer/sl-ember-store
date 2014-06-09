'use strict';

import Ember from 'ember';

var Model =  Ember.Object.extend({
     /**
     * Proxy the current instance to the class save method
     *
     * @public
     * @method save
     */
    save: function() {
        var data;

        if ( arguments[0] ) {
            data = arguments[0];
        }

        data = data || this;

        return this.constructor.adapter.save( this.url, data );
    },

    /**
     * Delete record
     *
     * @public
     * @method destroy
     * @param {integer} Record Id
     * @return {object} jqXHR from jQuery.ajax()
     */
    destroy: function( context ) {
        return this.constructor.adapter.destroy( this.url, context );
    }
});

Model..reopenClass({
    adapter: 'ajax',

    /**
     * Find One record without using an id
     * alias to find( null, options, true )
     *
     * @public
     * @method  findOne
     * @param {object} options hash of options for find method
     * @return {Ember.ObjectProxy}
     */
    findOne: function( options ) {
        return this.__find( null, options, true );
    },

    /**
     * Find all records for associated endpoint
     *
     * Example structure of the `options` parameter:
     *
     *   {
     *     data : {      // url parameters
     *       limit: 2
     *     },
     *     reload: true  // refresh cached data
     *   }
     *
     * @public
     * @method findAll
     * @param {integer} id
     * @param {object}  options
     * @return {Ember.ArrayProxy}
     */
    find: function( id, options ) {
        return this.__find( id, options, false );
    },

    /**
     * _find protected method
     * @param  {int}    id      record id
     * @param  {object} options hash of options
     * @param  {bool} findOne force return of single recrord
     * @return { ObjectProxy | ArrayProxy } The record or array of records requested
     */

    __find: function( id, options, findOne ) {
        return this.adapter.__find( this.url, id, options, findOne );
    },

    /**
     * Delete record
     *
     * @public
     * @method destroy
     * @param {integer} Record Id
     * @return {object} jqXHR from jQuery.ajax()
     */
    destroy: function( context ) {
        return this.adapter.destroy( this.url, context );
    }
});

export default Model;