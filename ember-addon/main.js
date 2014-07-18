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
        appTree,
        mergeTrees = require( 'broccoli-merge-trees' ),
        pickFiles = require( 'broccoli-static-compiler' );

    if( name === 'vendor' ) {
        vendorTree = mergeTrees([
            pickFiles( path.join( slmodelPath, 'node_modules', 'sl-modelize', 'dist' ), {
                    srcDir  : '/',
                    destDir : 'sl-modelize'
                }
            ),
            pickFiles( path.join( slmodelPath, 'dist' ), {
                    srcDir  : '/',
                    destDir : 'sl-model'
                }
            )
        ]);

        return vendorTree;
    } else if ( name === 'app' ) {
        appTree = pickFiles( path.join( slmodelPath, 'lib', 'initializers' ), {
            srcDir: '/',
            files: [ 'main.js' ],
            destDir : '/initializers'
        } );

        return appTree;
    }
};

SlModel.prototype.blueprintsPath = function() {
    var path = require( 'path' );
    return path.join( 'node_modules', 'sl-model', 'blueprints' );
};

SlModel.prototype.included = function included( app ) {
    this.app = app;

    this.app.import( 'vendor/sl-model/sl-model.js', {
        exports: {
            'sl-model': [
                'default',
                'store',
                'adapter',
                'adapter/ajax',
                'adapter/localstorage'
            ]
        }
    });
    this.app.import( 'vendor/sl-modelize/sl-modelize.js' );
};


module.exports = SlModel;