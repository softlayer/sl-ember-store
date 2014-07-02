'use strict';

function SlModel( project ) {
    this.project = project;
    this.name    = 'Sl-Model';
}

function unwatchedTree(dir) {
  return {
    read:    function() { return dir; },
    cleanup: function() { }
  };
}

SlModel.prototype.treeFor = function treeFor( name ) {
    var path = require('path'),
        slmodelPath = path.join( 'node_modules', 'sl-model' ),
        vendorTree,
        mergeTrees = require( 'broccoli-merge-trees' ),
        pickFiles = require( 'broccoli-static-compiler' );

    if( name === 'vendor' ){
        return mergeTrees([
            unwatchedTree( path.join( slmodelPath, 'vendor', 'sl-modelize', 'dist' ) ),
            unwatchedTree(
                pickFiles( path.join( slmodelPath, 'dist' ), {
                        srcDir  : '/',
                        files   : [ 'sl-model.js' ],
                        destDir : 'sl-model/dist'
                    }
                )
            )
        ]);
    }
};

SlModel.prototype.inluded = function included( app ) {
    this.app = app;

    this.app.import( 'vendor/sl-model/dist/sl-model.js' );
    this.app.import( 'vendor/sl-modelize/dist/sl-modelize.js' );
};