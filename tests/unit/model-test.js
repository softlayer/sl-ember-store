import Ember from 'ember';
import { test, moduleFor } from 'ember-qunit';
import Foo from 'dummy/models/foo';
import Bar from 'dummy/models/bar';
import Model from 'sl-ember-store/model';

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

module( 'Unit - sl-ember-store/model', {
    beforeEach: function() {

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
                        post: '/barCreate',
                        put: '/barUpdate',
                        delete: '/barDelete',
                        serializer: serializer1
                },
                car: {
                    post: {
                        url: '/carCreate',
                        serializer: serializer2,
                    },
                    put: {
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
                test: 'foo'
            },
            container: container
        });


        bar = Bar.create({
            content: {
                test: 'bar'
            },
            container: container
        });
    },
    afterEach: function() {
        adapter.save.reset();
        adapter.deleteRecord.reset();
        foo = Foo.create({
            content: {
                test: 'foo'
            },
            container: container
        });
        bar = Bar.create({
            content: {
                test: 'bar'
            },
            container: container
        });
    }
});

test( 'getUrlForEndpointAction:should return /bar for ( null, `get` )', function( assert ) {
    assert.equal( Bar.getUrlForEndpointAction( null, 'get' ), '/bar' );
});

test( 'getUrlForEndpointAction:should return /barCreate for ( null, `post` )', function( assert ) {
    assert.equal( Bar.getUrlForEndpointAction( null, 'post' ), '/barCreate' );
});

test( 'getUrlForEndpointAction:should return /barUpdate for ( null, `put` )', function( assert ) {
    assert.equal( Bar.getUrlForEndpointAction( null, 'put' ), '/barUpdate' );
});

test( 'getUrlForEndpointAction:should return /barDelete for ( null, `delete` )', function( assert ) {
    assert.equal( Bar.getUrlForEndpointAction( null, 'delete' ), '/barDelete' );
});

test( 'getUrlForEndpointAction:should return /bar for ( `default`, `get` )', function( assert ) {
    assert.equal( Bar.getUrlForEndpointAction( 'default', 'get' ), '/bar' );
});

test( 'getUrlForEndpointAction:should return /barCreate for ( `default`, `post` )', function( assert ) {
    assert.equal( Bar.getUrlForEndpointAction( 'default', 'post' ), '/barCreate' );
});

test( 'getUrlForEndpointAction:should return /barUpdate for ( `default`, `put` )', function( assert ) {
    assert.equal( Bar.getUrlForEndpointAction( 'default', 'put' ), '/barUpdate' );
});

test( 'getUrlForEndpointAction:should return /barDelete for ( `default`, `delete` )', function( assert ) {
    assert.equal( Bar.getUrlForEndpointAction( 'default', 'delete' ), '/barDelete' );
});

test( 'getUrlForEndpointAction:should return /bar for ( `car`, `get` )', function( assert ) {
    assert.equal( Bar.getUrlForEndpointAction( 'car', 'get' ), '/bar' );
});

test( 'getUrlForEndpointAction:should return /carCreate for ( `car`, `post` )', function( assert ) {
    assert.equal( Bar.getUrlForEndpointAction( 'car', 'post' ), '/carCreate' );
});

test( 'getUrlForEndpointAction:should return /carUpdate for ( `car`, `put` )', function( assert ) {
    assert.equal( Bar.getUrlForEndpointAction( 'car', 'put' ), '/carUpdate' );
});

test( 'getUrlForEndpointAction:should return /carDelete for ( `car`, `delete` )', function( assert ) {
    assert.equal( Bar.getUrlForEndpointAction( 'car', 'delete' ), '/carDelete' );
});

test( 'callSerializerForEndpointAction:should return testResponse1 for TestModel - ( `null`, `get` ) ', function( assert ) {
    var testResponse = TestModel.callSerializerForEndpointAction( null, 'get', {} );
    assert.equal( testResponse, testResponse1 );
});

test( 'callSerializerForEndpointAction:should return testResponse1 for TestModel - ( `test`, `get` ) ', function( assert ) {
    var testResponse = TestModel.callSerializerForEndpointAction( 'test', 'get', {} );
    assert.equal( testResponse, testResponse2 );
});

test( 'save-default:should call adapter.save with correct arguments', function( assert ) {
    assert.expect(2);
    foo.save().then( function() {
        assert.equal( adapter.save.args[0][0], '/foo' );
        assert.equal( adapter.save.args[0][1].test, 'foo' );
    });
});

test( 'save-default:should update its content with fooResponse', function( assert ) {
    assert.expect(1);
    foo.save().then(function() {
        assert.deepEqual( foo.get('content'), fooResponse );
    });
});

test( 'save-endpoint:should call adapter.save with correct arguments', function( assert ) {
    assert.expect(2);
    bar.save().then( function() {
        assert.equal( adapter.save.args[0][0], '/barCreate' );
        assert.equal( adapter.save.args[0][1].test, 'bar' );
    });
});

test( 'save-endpoint:should update its content with fooResponse', function( assert ) {
    assert.expect(1);
    bar.save().then( function() {
        assert.deepEqual( bar.get('content'), fooResponse );
    });
});

test( 'save-endpoint:car: should call adapter.save with correct arguments - NO id (POST)', function( assert ) {
    assert.expect(2);
    bar = Bar.create({
        content: {
            test: 'bar'
        },
        container: container
    });
    bar.save({endpoint:'car'}).then( function() {
        assert.equal( adapter.save.args[0][0], '/carCreate' );
        assert.equal( adapter.save.args[0][1].test, 'bar' );
    });
});

test( 'save-endpoint:car: should call adapter.save with correct arguments - WITH id (PUT)', function( assert ) {
    assert.expect(2);
    bar = Bar.create({
        content: {
            id : 3,
            test: 'bar'
        },
        container: container
    });
    bar.save({endpoint:'car'}).then( function() {
        assert.equal( adapter.save.args[0][0], '/carUpdate' );
        assert.equal( adapter.save.args[0][1].test, 'bar' );
    });
});

test( 'save-endpoint:car: should update its content with fooResponse', function( assert ) {
    bar = Bar.create({
        content: {
            test: 'bar'
        },
        container: container
    });
    bar.save({endpoint:'car'}).then( function() {
        assert.deepEqual( bar.get('content'), fooResponse );
    });
});

test( 'delete: should call adapter.deleteRecord with correct arguments', function( assert ) {
    var foo = Foo.create({
            id: 3,
            content: {
                test: 'foo'
            },
            container: container
    });
    assert.expect(1);
    foo.deleteRecord().then( function() {
        assert.ok( adapter.deleteRecord.calledWith( '/foo' ) );
    });
});

test( 'delete: should destroy foo', function( assert ) {
    var foo = Foo.create({
            id: 3,
            content: {
                test: 'foo'
            },
            container: container
    });
    assert.expect(1);
    foo.deleteRecord().then( function() {
        assert.ok( foo.isDestroyed );
    });

});

test( 'delete-endpoint: should call adapter.delete with correct arguments', function( assert ) {
    var bar = Bar.create({
            id: 3,
            content: {
                test: 'bar'
            },
            container: container
    });
    assert.expect(1);
    bar.deleteRecord().then( function() {
        assert.ok( adapter.deleteRecord.calledWith( '/barDelete' ) );
    });
});

test( 'delete-endpoint: should destroy bar', function( assert ) {
    var bar = Bar.create({
            id: 3,
            content: {
                test: 'bar'
            },
            container: container
    });
    assert.expect(1);
    bar.deleteRecord().then( function() {
        assert.ok( bar.isDestroyed );
    });
});

test( 'delete-endpoint:car: should call adapter.delete with correct arguments', function( assert ) {
    var bar = Bar.create({
            id: 3,
            content: {
                test: 'bar'
            },
            container: container
    });
    assert.expect(1);
    bar.deleteRecord({endpoint:'car'}).then( function() {
        assert.ok( adapter.deleteRecord.calledWith( '/carDelete' ) );
    });
});

test( 'delete-endpoint:car: should destroy bar', function( assert ) {
    var bar = Bar.create({
            id: 3,
            content: {
                test: 'bar'
            },
            container: container
    });
    assert.expect(1);
    bar.deleteRecord({endpoint:'car'}).then( function() {
        assert.ok( bar.isDestroyed );
    });
});
