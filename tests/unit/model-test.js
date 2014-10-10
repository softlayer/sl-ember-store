import Ember from 'ember';
import { test, moduleFor } from 'ember-qunit';
import Foo from 'dummy/models/foo';
import Bar from 'dummy/models/bar';
import Model from 'sl-model/model';

var foo,
    bar,
    adapter,
    container,
    fooResponse   = { id: 1, test: 'true' },
    ajaxMock      = function() {
        return new Ember.RSVP.Promise( function(resolve) { resolve( fooResponse ); });
    },
    serRespons1   = { test: true },
    serResponse2  = { test: false },
    serializer1   = function( response, store ){ return response; },
    serializer2   = function( response, store ){ return response; },
    testResponse1 = { test:true },
    testResponse2 = { test: false },
    TestModel     = Model.extend({});
    TestModel.reopenClass({
        serializer: function( response, store ){
            return testResponse1;
        },
        endpoints: {
            test: {
                get: {
                    serializer: function( response, store ){
                        return testResponse2;
                    }
                }
            }
        }
    });

module( 'Unit - sl-model/model', {
    setup: function() {

        Foo.reopenClass({
            url       :'/foo',
            endpoints : {
                doo: {
                    url: '/doo'
                },
                goo: {
                    serializer: serializer1,
                    post: {
                        url: '/goo',
                        serializer: serializer2
                    }
                }
            }
        });

        Bar.reopenClass({
            url       : '/bar',
            endpoints : {
                default: {
                        post: '/barUpdate',
                        delete: '/barDelete',
                        serializer: serializer1
                },
                car: {
                    post: {
                        url: '/carUpdate',
                        serializer: serializer2,
                    },
                    delete: '/carDelete'
                }
            }
        });

        adapter = {
            save         : ajaxMock,
            deleteRecord : ajaxMock,
        };

        sinon.spy( adapter, 'save' );
        sinon.spy( adapter, 'deleteRecord' );

        container = {
            registry: [],
            cache: {},
            normalize: function( key ) {
                return key;
            },
            lookup: function( key ) {
                if ( this.cache[key] ) return this.cache[key];

                var obj = this.registry.findBy( 'key', key ).factory.create({container:this});
                this.cache[key] = obj;
                return obj;
            },
            lookupFactory: function( key ){
                var item = this.registry.findBy( 'key', key );
                return item ? item.factory : undefined;
            }
        };

        container.cache['adapter:ajax'] = adapter;

        foo = Foo.create({
            content: {
                test: 'foo',
                'bar': { id: 1, quiz: 'bar' },
            },
            container: container
        });


        bar = Bar.create({
            content: {
                test: 'bar',
                'car': { id: 1, quiz: 'car' },
            },
            container: container
        });
    },
    teardown: function() {
        adapter.save.reset();
        adapter.deleteRecord.reset();
        foo = Foo.create({
            content: {
                test: 'foo',
                'bar': { id: 1, quiz: 'bar' },
            },
            container: container
        });
        bar = Bar.create({
            content: {
                test: 'bar',
                'car': { id: 1, quiz: 'car' },
            },
            container: container
        });
    }
});

test( 'getUrlForEndpointAction:should return /bar for ( null, `get` )', function() {
    equal( Bar.getUrlForEndpointAction( null, 'get' ), '/bar' );
});

test( 'getUrlForEndpointAction:should return /barUpdate for ( null, `post` )', function() {
    equal( Bar.getUrlForEndpointAction( null, 'post' ), '/barUpdate' );
});

test( 'getUrlForEndpointAction:should return /barDelete for ( null, `delete` )', function() {
    equal( Bar.getUrlForEndpointAction( null, 'delete' ), '/barDelete' );
});

test( 'getUrlForEndpointAction:should return /bar for ( `default`, `get` )', function() {
    equal( Bar.getUrlForEndpointAction( 'default', 'get' ), '/bar' );
});

test( 'getUrlForEndpointAction:should return /barUpdate for ( `default`, `post` )', function() {
    equal( Bar.getUrlForEndpointAction( 'default', 'post' ), '/barUpdate' );
});

test( 'getUrlForEndpointAction:should return /barDelete for ( `default`, `delete` )', function() {
    equal( Bar.getUrlForEndpointAction( 'default', 'delete' ), '/barDelete' );
});

test( 'getUrlForEndpointAction:should return /bar for ( `car`, `get` )', function() {
    equal( Bar.getUrlForEndpointAction( 'car', 'get' ), '/bar' );
});

test( 'getUrlForEndpointAction:should return /carUpdate for ( `car`, `post` )', function() {
    equal( Bar.getUrlForEndpointAction( 'car', 'post' ), '/carUpdate' );
});

test( 'getUrlForEndpointAction:should return /carDelete for ( `car`, `delete` )', function() {
    equal( Bar.getUrlForEndpointAction( 'car', 'delete' ), '/carDelete' );
});

test( 'callSerializerForEndpointAction:should return testResponse1 for TestModel - ( `null`, `get` ) ', function() {
    var testResponse = TestModel.callSerializerForEndpointAction( null, 'get', {} );
    equal( testResponse, testResponse1 );
});

test( 'callSerializerForEndpointAction:should return testResponse1 for TestModel - ( `test`, `get` ) ', function() {
    var testResponse = TestModel.callSerializerForEndpointAction( 'test', 'get', {} );
    equal( testResponse, testResponse2 );
});

test( 'save-default:should call adapter.save with correct arguments', function() {
    expect(2);
    foo.save().then( function() {
        equal( adapter.save.args[0][0], '/foo' );
        equal( adapter.save.args[0][1].test, 'foo' );
    });
});

test( 'save-default:should update its content with fooResponse', function() {
    expect(1);
    foo.save().then(function() {
        deepEqual( foo.get('content'), fooResponse );
    });
});

test( 'save-endpoint:should call adapter.save with correct arguments', function() {
    expect(2);
    bar.save().then( function() {
        equal( adapter.save.args[0][0], '/barUpdate' );
        equal( adapter.save.args[0][1].test, 'bar' );
    });
});
test( 'save-endpoint:should update its content with fooResponse', function() {
    expect(1);
    bar.save().then( function() {
        deepEqual( bar.get('content'), fooResponse );
    });
});

test( 'save-endpoint:car: should call adapter.save with correct arguments', function() {
    expect(2);
    bar = Bar.create({
        content: {
            test: 'bar',
            'car': { id: 1, quiz: 'car' },
        },
        container: container
    });
    bar.save({endpoint:'car'}).then( function() {
        equal( adapter.save.args[0][0], '/carUpdate' );
        equal( adapter.save.args[0][1].test, 'bar' );
    });
});

test( 'save-endpoint:car: should update its content with fooResponse', function() {
    bar = Bar.create({
        content: {
            test: 'bar',
            'car': { id: 1, quiz: 'car' },
        },
        container: container
    });
    bar.save({endpoint:'car'}).then( function() {
        deepEqual( bar.get('content'), fooResponse );
    });
});

test( 'delete: should call adapter.deleteRecord with correct arguments', function() {
    expect(1);
    foo.deleteRecord().then( function() {
        ok( adapter.deleteRecord.calledWith( '/foo' ) );
    });
});

test( 'delete: should destroy foo', function() {
    expect(1);
    foo.deleteRecord().then( function() {
        ok( foo.isDestroyed );
    });

});

test( 'delete-endpoint: should call adapter.delete with correct arguments', function() {
    expect(1);
    bar.deleteRecord().then( function() {
        ok( adapter.deleteRecord.calledWith( '/barDelete' ) );
    });
});

test( 'delete-endpoint: should destroy bar', function() {
    expect(1);
    bar.deleteRecord().then( function() {
        ok( bar.isDestroyed );
    });
});

test( 'delete-endpoint:car: should call adapter.delete with correct arguments', function() {
    expect(1);
    bar.deleteRecord({endpoint:'car'}).then( function() {
        ok( adapter.deleteRecord.calledWith( '/carDelete' ) );
    });
});

test( 'delete-endpoint:car: should destroy bar', function() {
    expect(1);
    bar.deleteRecord({endpoint:'car'}).then( function() {
        ok( bar.isDestroyed );
    });
});
