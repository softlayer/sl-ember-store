'use strict';

var expect = require('../../helpers/expect.js');

describe( 'store', function(){
    describe( 'create', function(){
        it( 'should exist', function(){
            var store = require( '../../../lib/store.js' );
            console.log(store);
            expect( store ).to.be.an( 'object' );
        });
    });
});