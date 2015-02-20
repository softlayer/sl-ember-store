/* jshint ignore:start */

/* jshint ignore:end */

define('dummy/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'dummy/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  var App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('dummy/initializers/app-version', ['exports', 'dummy/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;

  exports['default'] = {
    name: "App Version",
    initialize: function (container, application) {
      var appName = classify(application.toString());
      Ember['default'].libraries.register(appName, config['default'].APP.version);
    }
  };

});
define('dummy/initializers/export-application-global', ['exports', 'ember', 'dummy/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal && !window[classifiedName]) {
      window[classifiedName] = application;
    }
  };

  exports['default'] = {
    name: "export-application-global",

    initialize: initialize
  };

});
define('dummy/initializers/pretender', ['exports', 'pretender'], function (exports, Pretender) {

    'use strict';

    exports.initialize = initialize;

    var fooRecords = [{
        id: 1,
        text: "This is foo record with id: 1",
        bar: {
            id: 1,
            text: "This is a bar record with id: 1"
        }
    }, {
        id: 2,
        text: "This is foo record #2",
        bar: {
            id: 2,
            text: "This is a bar record with id: 2"
        }

    }, {
        id: 3,
        text: "This is foo record #3",
        bar: {
            id: 3,
            text: "This is a bar record with id: 3"
        }

    }, {
        id: 4,
        text: "This is foo record with id: 4",
        bar: {
            id: 4,
            text: "This is a bar record with id: 4"
        }
    }, {
        id: 5,
        text: "This is foo record #5",
        bar: {
            id: 5,
            text: "This is a bar record with id: 5"
        }

    }, {
        id: 6,
        text: "This is foo record #6",
        bar: {
            id: 6,
            text: "This is a bar record with id: 6"
        }

    }];function initialize() {
        new Pretender['default'](function () {
            this.get("/foo", function (request) {
                var id = request.queryParams.id && parseInt(request.queryParams.id) - 1,
                    start = request.queryParams.start || 0,
                    length = request.queryParams.length || fooRecords.length,
                    results = fooRecords.slice(start, length);

                if (request.queryParams.id) {
                    return [200, { "Content-Type": "application/json" }, JSON.stringify({ foo: fooRecords[id] })];
                }

                return [200, { "Content-Type": "application/json" }, JSON.stringify({ foo: results, meta: { total: fooRecords.length } })];
            });
            this.post("/foo", function (request) {
                var record = JSON.parse(request.requestBody);
                fooRecords[record.id] = record;
                return [200, { "Content-Type": "application/json" }, JSON.stringify(record)];
            });
        });
    }exports['default'] = {
        name: "pretender",
        after: "sl-ember-store",
        initialize: initialize
    };
    /* container, application */

});
define('dummy/initializers/sl-ember-store', ['exports', 'sl-ember-store/initializers/sl-ember-store'], function (exports, initializer) {

    'use strict';

    exports['default'] = {

        name: "sl-ember-store",

        initialize: initializer['default']
    };

});
define('dummy/models/bar', ['exports', 'sl-ember-store/model'], function (exports, Model) {

	'use strict';

	var Bar = Model['default'].extend({});


	exports['default'] = Bar;

});
define('dummy/models/car', ['exports', 'sl-ember-store/model'], function (exports, Model) {

    'use strict';

    var Car = Model['default'].extend({});

    Car.reopenClass({
        url: "/api/car",
        serializer: function (result) {
            return result.car;
        }
    });

    exports['default'] = Car;

});
define('dummy/models/foo', ['exports', 'sl-ember-store/model'], function (exports, Model) {

    'use strict';

    var Foo = Model['default'].extend({});

    Foo.reopenClass({
        url: "/foo",
        serializer: function (data, store) {
            if (data.meta) {
                store.metaForType("foo", data.meta);
            }

            return data.foo;
        }
    });

    exports['default'] = Foo;

});
define('dummy/router', ['exports', 'ember', 'dummy/config/environment'], function (exports, Ember, config) {

    'use strict';

    var Router = Ember['default'].Router.extend({
        location: config['default'].locationType
    });

    Router.map(function () {
        this.route("index", { path: "/" });

        this.resource("demos", function () {
            this.route("singleModel", { path: "/singleModel/:model_id" });
            this.route("arrayOfModels", { path: "/arrayOfModels" });
        });
    });

    exports['default'] = Router;

});
define('dummy/routes/demos/array-of-models', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Route.extend({
        actions: {
            addSomeRecords: function () {
                this.loadRecords({ add: true, data: { start: 3, length: 6 } });
            },
            loadSomeRecords: function () {
                this.loadRecords({ data: { start: 3, length: 6 } });
            },
            addAllRecords: function () {
                this.loadRecords({ add: true });
            },
            reloadFirstRecords: function () {
                this.loadRecords({ reload: true, data: { start: 0, length: 3 } });
            } },

        loadRecords: function (options) {
            var controller = this.controller,
                records = this.store.find("foo", options);

            controller.set("model2", records);

            records.then(Ember['default'].run.bind(this, function () {
                controller.set("model2meta", this.store.metadataFor("foo"));
                this.store.find("foo").then(function (records) {
                    controller.set("model2CachedTotalCount", records.length);
                });
            }));
        },

        model: function () {
            var initialRequest = this.store.find("foo", null, { data: { start: 0, length: 3 } });

            return initialRequest;
        },

        setupController: function (controller, model) {
            controller.set("model", model);
            controller.set("model2", model);
            controller.set("model2CachedTotalCount", model.length);
            controller.set("model2meta", this.store.metadataFor("foo"));
        }
    });

});
define('dummy/routes/demos/single-model', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Route.extend({
        model: function (params) {
            return this.store.find("foo", params.model_id);
        }
    });

});
define('dummy/sl-ember-modelize/tests/modules/sl-ember-modelize/mixins/modelize.jshint', function () {

  'use strict';

  module("JSHint - modules/sl-ember-modelize/mixins");
  test("modules/sl-ember-modelize/mixins/modelize.js should pass jshint", function () {
    ok(true, "modules/sl-ember-modelize/mixins/modelize.js should pass jshint.");
  });

});
define('dummy/sl-ember-store/tests/modules/sl-ember-store/adapter.jshint', function () {

  'use strict';

  module("JSHint - modules/sl-ember-store");
  test("modules/sl-ember-store/adapter.js should pass jshint", function () {
    ok(true, "modules/sl-ember-store/adapter.js should pass jshint.");
  });

});
define('dummy/sl-ember-store/tests/modules/sl-ember-store/adapters/ajax.jshint', function () {

  'use strict';

  module("JSHint - modules/sl-ember-store/adapters");
  test("modules/sl-ember-store/adapters/ajax.js should pass jshint", function () {
    ok(true, "modules/sl-ember-store/adapters/ajax.js should pass jshint.");
  });

});
define('dummy/sl-ember-store/tests/modules/sl-ember-store/adapters/localstorage.jshint', function () {

  'use strict';

  module("JSHint - modules/sl-ember-store/adapters");
  test("modules/sl-ember-store/adapters/localstorage.js should pass jshint", function () {
    ok(true, "modules/sl-ember-store/adapters/localstorage.js should pass jshint.");
  });

});
define('dummy/sl-ember-store/tests/modules/sl-ember-store/cache.jshint', function () {

  'use strict';

  module("JSHint - modules/sl-ember-store");
  test("modules/sl-ember-store/cache.js should pass jshint", function () {
    ok(true, "modules/sl-ember-store/cache.js should pass jshint.");
  });

});
define('dummy/sl-ember-store/tests/modules/sl-ember-store/debug-adapter.jshint', function () {

  'use strict';

  module("JSHint - modules/sl-ember-store");
  test("modules/sl-ember-store/debug-adapter.js should pass jshint", function () {
    ok(true, "modules/sl-ember-store/debug-adapter.js should pass jshint.");
  });

});
define('dummy/sl-ember-store/tests/modules/sl-ember-store/initializers/sl-ember-store.jshint', function () {

  'use strict';

  module("JSHint - modules/sl-ember-store/initializers");
  test("modules/sl-ember-store/initializers/sl-ember-store.js should pass jshint", function () {
    ok(true, "modules/sl-ember-store/initializers/sl-ember-store.js should pass jshint.");
  });

});
define('dummy/sl-ember-store/tests/modules/sl-ember-store/model.jshint', function () {

  'use strict';

  module("JSHint - modules/sl-ember-store");
  test("modules/sl-ember-store/model.js should pass jshint", function () {
    ok(true, "modules/sl-ember-store/model.js should pass jshint.");
  });

});
define('dummy/sl-ember-store/tests/modules/sl-ember-store/store.jshint', function () {

  'use strict';

  module("JSHint - modules/sl-ember-store");
  test("modules/sl-ember-store/store.js should pass jshint", function () {
    ok(true, "modules/sl-ember-store/store.js should pass jshint.");
  });

});
define('dummy/templates/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    
    data.buffer.push("<i class=\"fa fa-home\"></i> Home");
    }

    data.buffer.push("<br>\n<div class=\"container\">\n\n    <div class=\"row\">\n        <div class=\"col-md-12\">\n            <div class=\"btn-group pull-right\">\n                <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\">\n                    <i class=\"fa fa-reorder\"></i> <span class=\"caret\"></span>\n                </button>\n\n                <ul class=\"dropdown-menu\" role=\"menu\">\n                <li>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "index", options) : helperMissing.call(depth0, "link-to", "index", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n                <li><a href=\"https://github.com/softlayer/sl-ember-store/blob/master/README.md\"><i class=\"fa fa-wrench\"></i> Get Started</a></li>\n                <li><a href=\"https://github.com/softlayer/sl-ember-store/blob/master/CONTRIBUTING.md\"><i class=\"fa fa-cog\"></i> Contribution Guide</a></li>\n                <li><a href=\"https://github.com/softlayer/sl-ember-store/stargazers\"><i class=\"fa fa-star\"></i> Star Our Repo</a></li>\n                <li><a href=\"https://github.com/softlayer/sl-ember-store/fork\"><i class=\"fa fa-code-fork\"></i> Fork Our Repo</a></li>\n                </ul>\n            </div>\n        </div>\n    </div>\n\n    ");
    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n    <br><br>\n    <div class=\"row\">\n        <div class=\"col-md-12 text-center\">\n            <p>ember install:addon sl-ember-store</p>\n            <p><a href=\"https://github.com/softlayer/sl-ember-store/blob/master/LICENSE.md\">MIT Licensed</a></p>\n        </div>\n    </div>\n</div>\n");
    return buffer;
    
  });

});
define('dummy/templates/demos', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    
    data.buffer.push("Demo Application");
    }

  function program3(depth0,data) {
    
    
    data.buffer.push("Single model example");
    }

  function program5(depth0,data) {
    
    
    data.buffer.push("Array of models example");
    }

    data.buffer.push("<div class=\"row\">\n    <div class=\"col-md-12 text-center\">\n        <h1>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "demos", options) : helperMissing.call(depth0, "link-to", "demos", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</h1>\n        <p class=\"lead\">View the source code of the dummy application for syntax employed in this demo</p>\n    </div>\n</div>\n\n<div class=\"row\">\n    <div class=\"col-md-12 text-center\">\n        ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0,depth0],types:["STRING","INTEGER"],data:data},helper ? helper.call(depth0, "demos.singleModel", 1, options) : helperMissing.call(depth0, "link-to", "demos.singleModel", 1, options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n        ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "demos.arrayOfModels", options) : helperMissing.call(depth0, "link-to", "demos.arrayOfModels", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    </div>\n</div>\n\n");
    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    return buffer;
    
  });

});
define('dummy/templates/demos/array-of-models', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n            <h4>Foo Model</h4>\n\n            <ul>\n            <li>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "demos.singleModel", "model.id", options) : helperMissing.call(depth0, "link-to", "demos.singleModel", "model.id", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n            <li>Text: ");
    stack1 = helpers._triageMustache.call(depth0, "model.text", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n            ");
    stack1 = helpers['if'].call(depth0, "model.bar.id", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        ");
    return buffer;
    }
  function program2(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("ID: ");
    stack1 = helpers._triageMustache.call(depth0, "model.id", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    return buffer;
    }

  function program4(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n                <ul>\n                <h4>Bar Model</h4>\n                <li>ID: ");
    stack1 = helpers._triageMustache.call(depth0, "model.bar.id", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n                <li>Text: ");
    stack1 = helpers._triageMustache.call(depth0, "model.bar.text", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n                </ul>\n            </ul>\n            ");
    return buffer;
    }

  function program6(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n                    <h4>Foo Model</h4>\n\n                    <ul>\n                    <li>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "demos.singleModel", "model.id", options) : helperMissing.call(depth0, "link-to", "demos.singleModel", "model.id", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n                    <li>Text: ");
    stack1 = helpers._triageMustache.call(depth0, "model.text", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n                    ");
    stack1 = helpers['if'].call(depth0, "model.bar.id", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                ");
    return buffer;
    }
  function program7(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n                        <ul>\n                        <h4>Bar Model</h4>\n                        <li>ID: ");
    stack1 = helpers._triageMustache.call(depth0, "model.bar.id", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n                        <li>Text: ");
    stack1 = helpers._triageMustache.call(depth0, "model.bar.text", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n                        </ul>\n                    </ul>\n                    ");
    return buffer;
    }

    data.buffer.push("<div class=\"row\">\n    <div class=\"col-md-12\">\n\n        <h2>Array of Models</h2>\n\n        <p>These records can be loaded in our route's model hook with the following code:</p>\n\n        <code>this.store.find('foo');</code>\n\n        <br><br>\n        <p>The `foo` model has its adapter set to the ajax adapter*.  The \"/foo\" resource contains foo records with embedded \"bar\" records.  These records are automatically created as an instance of the \"Bar\" model when the data is returned from the adapter.</p>\n\n        <br>\n        ");
    stack1 = helpers.each.call(depth0, "model", "in", "controller", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n\n        <br>\n        <p>The original JSON for this resource:</p>\n\n        <pre>\n{\n    id: 1,\n    text: 'This is foo record with id: 1',\n    bar: {\n        id: 1,\n        text: 'This is a bar record with id: 1'\n    }\n},\n{\n    id: 2,\n    text: 'This is foo record #2',\n    bar: {\n        id: 2,\n        text: 'This is a bar record with id: 2'\n    }\n\n},\n{\n    id: 3,\n    text: 'This is foo record #3',\n    bar: {\n        id: 3,\n        text: 'This is a bar record with id: 3'\n    }\n\n}\n        </pre>\n        <p>* We are actually using <a href=\"https://github.com/rwjblue/ember-cli-pretender\">Pretender</a> to mockup our data. This library is great for static gh-pages!</p>\n\n        <h3>Caching and Options</h3>\n\n        <p>Our store implements a simple caching layer.  The caching layer recoginzes requests for multiple records and will check to see if one has already been made.  If so then it returns the records in its cache.  However, you may wish to override this default behavior and fetch the records again through the adapter.  This can be accomplished by passing a flag through the <code>store.find</code> method's <code>options</code> parameter.</p>\n\n        <p>When fetching many records there are two flags you can pass along in the <code>options</code> object to control how your records are cached:\n            <dl>\n                <dt>options.reload</dt>\n                <dd>Clear the cache for this record type and load new records from the adapter</dd>\n\n                <dt>options.add</dt>\n                <dd>Request new records from the adapter and add them to the cache</dd>\n            </dl>\n\n        <p>Additionally there is a third key on the options object:</p>\n            <dl>\n                <dt>options.data</dt>\n                <dd>An object of key/value pairs that will be passed to the adapter\n            </dl>\n       In the case of the ajax adapter these key/value pairs will be transformed into query parameters.</p>\n\n        <p>Earlier I said that these records can be loaded with <code>this.store.find('foo')</code>.  While that is true, the code we actually used was <code>this.store.find( 'foo', { data: { start: 0, length: 3} } )</code>.  This only loaded a subset of the records available.  The following two buttons will demonstrate the functionality of the <code>reload</code> and <code>add</code> flags:</p>\n        <div class=\"row\">\n            <div class=\"col-md-12\">\n                <ul class=\"list-group\">\n                <li class=\"list-group-item\"><button class=\"btn btn-primary\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "addSomeRecords", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">Add Some Records</button> will run <code>this.store.find( 'foo', { add: true, data: { start: 3, length: 6 } } ) </code></li>\n                <li class=\"list-group-item\"><button class=\"btn btn-primary\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "addAllRecords", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">Add All Records</button> will run <code>this.store.find( 'foo', { add: true } ) //server responds with all records</code></li>\n                <li class=\"list-group-item\"><button class=\"btn btn-primary\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "reloadFirstRecords", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">Reload First Records</button> will run to <code>this.store.find( 'foo', { reload: true, data: { start: 0, length: 3} } )</code></li>\n                </ul>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"col-md-4\">\n                <ul class=\"list-group\">\n                    <li class=\"list-group-item\">Total records on server: <span class=\"badge\">");
    stack1 = helpers._triageMustache.call(depth0, "model2meta.total", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</span></li>\n                    <li class=\"list-group-item\">Total records in cache: <span class=\"badge\">");
    stack1 = helpers._triageMustache.call(depth0, "model2CachedTotalCount", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</span></li>\n                    <li class=\"list-group-item\">Total records in controller: <span class=\"badge\">");
    stack1 = helpers._triageMustache.call(depth0, "model2.length", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</span></li>\n                </ul>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"col-md-12\">\n\n                ");
    stack1 = helpers.each.call(depth0, "model", "in", "controller.model2", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n            </div>\n        </div>\n        <p>If you specify <code>options.data</code> key value pairs without specifying <code>add</code> or <code>reload</code> then we assume <code>add</code> by default.</p>\n    </div>\n</div>");
    return buffer;
    
  });

});
define('dummy/templates/demos/single-model', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    data.buffer.push("<div class=\"row\">\n    <div class=\"col-md-12\">\n\n        <h2>Single Model</h2>\n\n        <p>This record is loaded in our route's model hook with the following code:</p>\n\n        <code>this.store.find( 'foo', params.model_id );</code>\n\n        <br><br>\n        <p>The model is loaded by the store via the ajax adapter.  The \"/foo?id=1\" resource contains an embedded \"bar\" record, and this record is automatically created as an instance of the \"Bar\" model.</p>\n\n        <br>\n        <h4>Foo Model</h4>\n\n        <ul>\n        <li>ID: ");
    stack1 = helpers._triageMustache.call(depth0, "model.id", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n        <li>Text: ");
    stack1 = helpers._triageMustache.call(depth0, "model.text", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n            <ul>\n                <h4>Bar Model</h4>\n                <li>ID: ");
    stack1 = helpers._triageMustache.call(depth0, "model.bar.id", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n                <li>Text: ");
    stack1 = helpers._triageMustache.call(depth0, "model.bar.text", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n            </ul>\n        </ul>\n\n        <br>\n        <p>The original JSON for this resource:</p>\n\n        <pre>\n{\n    id: ");
    stack1 = helpers._triageMustache.call(depth0, "model.id", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(",\n    text: '");
    stack1 = helpers._triageMustache.call(depth0, "model.text", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("',\n    bar: {\n        id: ");
    stack1 = helpers._triageMustache.call(depth0, "model.bar.id", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(",\n        text: '");
    stack1 = helpers._triageMustache.call(depth0, "model.bar.text", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("'\n    }\n}\n</pre>\n\n    </div>\n</div>");
    return buffer;
    
  });

});
define('dummy/templates/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    
    data.buffer.push("<i class=\"fa fa-cubes fa-5x\"></i>");
    }

  function program3(depth0,data) {
    
    
    data.buffer.push("<b>Demo</b>");
    }

    data.buffer.push("<div class=\"row\">\n    <div class=\"col-md-12 text-center\">\n        <h1>sl-ember-store</h1>\n        <p class=\"lead\">An Ember CLI Addon to provide a model layer for an Ember application.</p>\n    </div>\n</div>\n\n<div class=\"row\">\n    <div class=\"col-md-4 text-center\">\n        <h3>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "demos", options) : helperMissing.call(depth0, "link-to", "demos", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</h3>\n        <p>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "demos", options) : helperMissing.call(depth0, "link-to", "demos", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</p>\n    </div>\n    <div class=\"col-md-4 text-center\">\n        <h3><a href=\"https://github.com/softlayer/sl-ember-store/blob/master/README.md\"><i class=\"fa fa-book fa-5x\"></i></a></h3>\n        <p><a href=\"https://github.com/softlayer/sl-ember-store/blob/master/README.md\"><b>Documentation</b></a></p>\n    </div>\n    <div class=\"col-md-4 text-center\">\n        <h3><a href=\"https://github.com/softlayer/sl-ember-store\"><i class=\"fa fa-github fa-5x\"></i></a></h3>\n        <p><a href=\"https://github.com/softlayer/sl-ember-store\"><b>Available on GitHub</b></a></p>\n    </div>\n</div>");
    return buffer;
    
  });

});
define('dummy/tests/acceptance/array-of-models-test', ['ember', 'dummy/tests/helpers/start-app', 'dummy/models/foo', 'ember-qunit'], function (Ember, startApp, Foo, ember_qunit) {

  'use strict';

  var App;

  module("Acceptance: ArrayOfModels", {
    beforeEach: function () {
      App = startApp['default']();
    },
    afterEach: function () {
      Ember['default'].run(App, "destroy");
    }
  });

  ember_qunit.test("visiting /arrayOfModels", function (assert) {
    visit("/demos/arrayOfModels");

    andThen(function () {
      var arrayModelController = App.__container__.lookup("controller:demos/arrayOfModels");
      assert.equal(currentPath(), "demos.arrayOfModels");
      assert.ok(arrayModelController.get("model.0") instanceof Foo['default'], "Controllers model is instance of Foo");
    });
  });

});
define('dummy/tests/acceptance/array-of-models-test.jshint', function () {

  'use strict';

  module('JSHint - acceptance');
  test('acceptance/array-of-models-test.js should pass jshint', function() { 
    ok(true, 'acceptance/array-of-models-test.js should pass jshint.'); 
  });

});
define('dummy/tests/acceptance/single-model-test', ['ember', 'dummy/tests/helpers/start-app', 'dummy/models/foo', 'ember-qunit'], function (Ember, startApp, Foo, ember_qunit) {

  'use strict';

  var App;

  module("Acceptance: SingleModel", {
    beforeEach: function () {
      App = startApp['default']();
    },
    afterEach: function () {
      Ember['default'].run(App, "destroy");
    }
  });

  ember_qunit.test("visiting /singleModel", function (assert) {
    visit("/demos/singleModel/1");

    andThen(function () {
      var singleModelController = App.__container__.lookup("controller:demos/singleModel");
      assert.equal(currentPath(), "demos.singleModel");
      assert.ok(singleModelController.get("model") instanceof Foo['default'], "Controllers model is instance of Foo");
    });
  });

});
define('dummy/tests/acceptance/single-model-test.jshint', function () {

  'use strict';

  module('JSHint - acceptance');
  test('acceptance/single-model-test.js should pass jshint', function() { 
    ok(true, 'acceptance/single-model-test.js should pass jshint.'); 
  });

});
define('dummy/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(true, 'app.js should pass jshint.'); 
  });

});
define('dummy/tests/helpers/module-for-sl-ember-model', ['exports', 'ember-qunit', 'ember', 'sl-ember-store/store'], function (exports, ember_qunit, Ember, Store) {

    'use strict';




    exports['default'] = moduleForSlEmberModel;
    function moduleForSlEmberModel(name, description, callbacks) {
        ember_qunit.moduleFor("model:" + name, description, callbacks, function (container, context, defaultSubject) {
            container.register("store:main", Store['default']);

            context.__setup_properties__.store = function () {
                return container.lookup("store:main");
            };

            if (context.__setup_properties__.subject === defaultSubject) {
                context.__setup_properties__.subject = function (options) {
                    return Ember['default'].run(function () {
                        return container.lookup("store:main").createRecord(name, options);
                    });
                };
            }
        });
    }

});
define('dummy/tests/helpers/resolver', ['exports', 'ember/resolver', 'dummy/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('dummy/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('dummy/tests/helpers/start-app', ['exports', 'ember', 'dummy/app', 'dummy/router', 'dummy/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('dummy/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('dummy/tests/initializers/pretender.jshint', function () {

  'use strict';

  module('JSHint - initializers');
  test('initializers/pretender.js should pass jshint', function() { 
    ok(true, 'initializers/pretender.js should pass jshint.'); 
  });

});
define('dummy/tests/models/bar.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/bar.js should pass jshint', function() { 
    ok(true, 'models/bar.js should pass jshint.'); 
  });

});
define('dummy/tests/models/car.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/car.js should pass jshint', function() { 
    ok(true, 'models/car.js should pass jshint.'); 
  });

});
define('dummy/tests/models/foo.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/foo.js should pass jshint', function() { 
    ok(true, 'models/foo.js should pass jshint.'); 
  });

});
define('dummy/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(true, 'router.js should pass jshint.'); 
  });

});
define('dummy/tests/routes/demos/array-of-models.jshint', function () {

  'use strict';

  module('JSHint - routes/demos');
  test('routes/demos/array-of-models.js should pass jshint', function() { 
    ok(true, 'routes/demos/array-of-models.js should pass jshint.'); 
  });

});
define('dummy/tests/routes/demos/single-model.jshint', function () {

  'use strict';

  module('JSHint - routes/demos');
  test('routes/demos/single-model.js should pass jshint', function() { 
    ok(true, 'routes/demos/single-model.js should pass jshint.'); 
  });

});
define('dummy/tests/test-helper', ['dummy/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('dummy/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
define('dummy/tests/unit/adapters-test', ['ember', 'ember-qunit', 'sl-ember-store/adapter'], function (Ember, ember_qunit, Adapter) {

    'use strict';

    var adapter,
        store = {
        runPostQueryHooks: sinon.spy(),
        runPreQueryHooks: sinon.spy()
    };

    module("Unit - sl-ember-store/adapter", {
        beforeEach: function () {
            adapter = Adapter['default'].create({
                container: {
                    lookup: function (type) {
                        if (type === "store:main") return store;else Ember['default'].Assert("Container could not find \"" + type + "\"", false);
                    }
                }
            });
        },
        afterEach: function () {
            store.runPostQueryHooks.reset();
            store.runPreQueryHooks.reset();
        }
    });
    ember_qunit.test("runPreQueryHooks should run the prequeryhook once", function (assert) {
        adapter.runPreQueryHooks();
        assert.ok(store.runPreQueryHooks.calledOnce);
    });

    ember_qunit.test("runPreQueryHooks should not have run postqueryhook", function (assert) {
        adapter.runPreQueryHooks();
        assert.equal(store.runPostQueryHooks.callCount, 0);
    });

    ember_qunit.test("runPostQueryHooks should run the postqueryhook once", function (assert) {
        adapter.runPostQueryHooks();
        assert.ok(store.runPostQueryHooks.calledOnce);
    });
    ember_qunit.test("runPostQueryHooks should not have run the prequeryhook", function (assert) {
        adapter.runPostQueryHooks();
        assert.equal(store.runPreQueryHooks.callCount, 0);
    });

});
define('dummy/tests/unit/adapters-test.jshint', function () {

  'use strict';

  module('JSHint - unit');
  test('unit/adapters-test.js should pass jshint', function() { 
    ok(true, 'unit/adapters-test.js should pass jshint.'); 
  });

});
define('dummy/tests/unit/adapters/ajax-test', ['ember', 'ember-qunit', 'sl-ember-store/model', 'sl-ember-store/adapter', 'sl-ember-store/store', 'sl-ember-store/adapters/ajax'], function (Ember, ember_qunit, Model, Adapter, Store, AjaxAdapter) {

    'use strict';

    var icAjax = require("ic-ajax");

    var ajaxAdapter,
        Foo = Model['default'].extend(),
        Bar = Model['default'].extend(),
        defineFixture = icAjax.defineFixture,
        response,
        requestSpy;

    module("Unit - sl-ember-store/adapter/ajax", {
        beforeEach: function () {
            var container = {
                registry: [],
                cache: {},
                normalize: function (key) {
                    return key;
                },
                lookup: function (key) {
                    if (this.cache[key]) return this.cache[key];

                    var obj = this.registry.findBy("key", key).factory.create({ container: this });
                    this.cache[key] = obj;
                    return obj;
                },
                lookupFactory: function (key) {
                    var item = this.registry.findBy("key", key);
                    return item ? item.factory : undefined;
                }
            };

            ajaxAdapter = AjaxAdapter['default'].create({
                container: container,
                store: Store['default'].create({ container: container })
            });
            //register mock data
            ajaxAdapter.container.cache["store:main"] = {
                runPostQueryHooks: sinon.spy(),
                runPreQueryHooks: sinon.spy()
            };

            ajaxAdapter.container.registry.push({ key: "model:foo", factory: Foo });
            ajaxAdapter.container.registry.push({ key: "model:bar", factory: Bar });

            defineFixture("/foo", {
                response: { id: 1, test: "foo", bar: { id: 1, quiz: "bar" } },
                jqXHR: {},
                textStatus: "success"
            });
            defineFixture("/foo-fail", {
                errorThrown: "this is an error msg",
                jqXHR: {},
                textStatus: "error"
            });
            defineFixture("/bar", {
                response: [{ id: 1, quiz: "bar" }, { id: 2, quiz: "bar2" }],
                jqXHR: {},
                textStatus: "success"
            });
            defineFixture("/no-results", {
                response: [],
                jqXHR: {},
                textStatus: "success"
            });
            Foo.reopenClass({
                url: "/foo",
                endpoints: {
                    fail: {
                        url: "/foo-fail"
                    },
                    noResults: {
                        url: "/no-results"
                    }
                }
            });

            Bar.reopenClass({ url: "/bar" });

            //spies
            requestSpy = sinon.spy(icAjax, "request");
        },
        afterEach: function () {
            icAjax.request.restore();
        }
    });

    function ajaxTestSuite(assert) {
        assert.ok(requestSpy.calledOnce, "request called once");
        assert.ok(response.then, "response is a promise");
        assert.ok(Ember['default'].PromiseProxyMixin.detect(response), "response is a promise proxy");
    }

    asyncTest("__find single model with id", function (assert) {
        assert.expect(6);
        response = ajaxAdapter.find("foo", 1);

        assert.equal(requestSpy.args[0][0].url, "/foo", "should call icAjax.request with the correct arguments");

        assert.equal(requestSpy.args[0][0].data.id, 1, "should call icAjax.request with the correct arguments");

        ajaxTestSuite(assert);

        response.then(function () {
            assert.ok(response.get("content") instanceof Foo, "response is instance of Foo");
            start();
        });
    });

    asyncTest("__find single model with no id", function (assert) {
        var options = { data: { main: true } };

        response = ajaxAdapter.find("foo", null, options, true);

        assert.equal(requestSpy.args[0][0].url, "/foo", "should call icAjax.request with the correct arguments");

        assert.ok(requestSpy.args[0][0].data.main, "should call icAjax.request with the correct arguments");

        ajaxTestSuite(assert);

        response.then(function () {
            assert.ok(response.get("content") instanceof Foo, "response is instance of Foo");
            start();
        });
    });

    asyncTest("__find array of model", function (assert) {
        var options = { data: { main: true } };
        //request
        response = ajaxAdapter.find("bar", null, options, false);

        ajaxTestSuite(assert);

        assert.ok(response instanceof Ember['default'].ArrayProxy, "should return an instance of Ember.ArrayProxy");
        response.then(function () {
            assert.ok(response.content[0] instanceof Bar, "should return an array of Bar models");
            assert.ok(response.content[1] instanceof Bar, "should return an array of Bar models");
            start();
        });
    });


    asyncTest("find should throw error if request fails", function (assert) {
        var options = { endpoint: "fail" },
            promise = ajaxAdapter.find("foo", null, options, false);

        promise.then(function (result) {
            assert.ok(false, "find did not throw an error!");
            start();
        }, function (result) {
            assert.equal(result.textStatus, "error", "find did throw error");
            start();
        });
    });

    asyncTest("find should not throw error if response is empty", function (assert) {
        var options = { endpoint: "noResults" },
            promise = ajaxAdapter.find("foo", null, options, false);

        promise.then(function (result) {
            assert.ok(true, "find did not throw an error.");
            start();
        }, function (result) {
            assert.ok(false, "find threw an error!");
            start();
        });
    });

    ember_qunit.test("save", function (assert) {
        var foo = Foo.create({ test: "foo", bar: { id: 1, quiz: "bar" } });
        response = ajaxAdapter.save("/foo", foo);
        assert.ok(requestSpy.calledOnce, "should call icAjax request once");
        assert.equal(requestSpy.args[0][0].url, "/foo", "should call icAjax with correct url");
        assert.equal(requestSpy.args[0][0].type, "POST", "should call icAjax with correct method");
        assert.equal(typeof requestSpy.args[0][0].data, "string", "icAjax should return a string");
    });

    ember_qunit.test("save, should call $.ajax with the correct arguments", function (assert) {
        var foo = Foo.create({ test: "foo", bar: { id: 1, quiz: "bar" } });
        response = ajaxAdapter.save("/foo", foo);
        assert.ok(requestSpy.calledOnce, "request called once");
        assert.equal(requestSpy.args[0][0].url, "/foo");
        assert.equal(requestSpy.args[0][0].type, "POST");
        assert.equal(typeof requestSpy.args[0][0].data, "string");
        assert.ok(response.then, "response is a promise");
    });

    ember_qunit.test("delete, should call icAjax.request once", function (assert) {
        var foo = Foo.create({ id: 1, test: "foo", bar: { id: 1, quiz: "bar" } });
        response = ajaxAdapter.deleteRecord("/foo", 1);

        assert.ok(requestSpy.calledOnce);
        assert.equal(requestSpy.args[0][0].url, "/foo", "should call icAjax with correct url");
        assert.equal(requestSpy.args[0][0].type, "DELETE", "should call icAjax with correct url");
        assert.equal(typeof requestSpy.args[0][0].data, "string", "icAjax should return a string");
        assert.ok(response.then, "response is a proxy");
    });

});
define('dummy/tests/unit/adapters/ajax-test.jshint', function () {

  'use strict';

  module('JSHint - unit/adapters');
  test('unit/adapters/ajax-test.js should pass jshint', function() { 
    ok(true, 'unit/adapters/ajax-test.js should pass jshint.'); 
  });

});
define('dummy/tests/unit/adapters/localstorage-test', ['ember', 'ember-qunit', 'sl-ember-store/model', 'sl-ember-store/adapter', 'sl-ember-store/store', 'sl-ember-store/adapters/localstorage'], function (Ember, ember_qunit, Model, Adapter, Store, LocalStorageAdapter) {

    'use strict';

    var localstorageadapter,
        localStorageBackup,
        localStorage,
        container,
        getLocalStorageSpy,
        requestSpy,
        saveSpy,
        response,
        Foo = Model['default'].extend(),
        Bar = Model['default'].extend();

    module("Unit - sl-ember-store/adapter/localstorage", {
        beforeEach: function () {
            localStorage = {
                _ns: "testLSObject",
                setItem: function (item, content) {
                    this[item] = content;
                },
                getItem: function (item) {
                    return this[item];
                }
            };
            container = {
                registry: [],
                cache: {},
                normalize: function (key) {
                    return key;
                },
                lookup: function (key) {
                    if (this.cache[key]) return this.cache[key];

                    var obj = this.registry.findBy("key", key).factory.create({ container: this });
                    this.cache[key] = obj;
                    return obj;
                },
                lookupFactory: function (key) {
                    var item = this.registry.findBy("key", key);
                    return item ? item.factory : undefined;
                }
            };
            localstorageadapter = LocalStorageAdapter['default'].create({
                container: container,
                store: Store['default'].create({ container: container })
            });

            //register mock data
            localstorageadapter.container.cache["store:main"] = {
                runPostQueryHooks: sinon.spy(),
                runPreQueryHooks: sinon.spy()
            };

            Foo.reopenClass({ url: "/foo", adapter: "localstorage" });
            Bar.reopenClass({ url: "/bar", adapter: "localstorage" });

            localstorageadapter.container.registry.push({ key: "model:foo", factory: Foo });
            localstorageadapter.container.registry.push({ key: "model:bar", factory: Bar });

            getLocalStorageSpy = sinon.stub(localstorageadapter, "_getLocalStorage", function () {
                return localStorage;
            });

            localstorageadapter.save("/foo", { id: 1, test: "foo", bar: { id: 1, quiz: "bar" } });
            localstorageadapter.save("/bar", { id: 1, quiz: "bar" });
            localstorageadapter.save("/bar", { id: 2, quiz: "bar2" });

            //spies
            requestSpy = sinon.spy(localStorage, "getItem");
            saveSpy = sinon.spy(localStorage, "setItem");
        },
        afterEach: function () {
            localStorage.getItem.restore();
            localStorage.setItem.restore();
            getLocalStorageSpy.restore();
        }
    });

    asyncTest("__find single model with id", function (assert) {
        response = localstorageadapter.find("foo", 1, { label: "1" });
        assert.equal(requestSpy.args[0][0], "sl-ember-store", "calls request with correct args");
        assert.ok(response.then, "response is a promise");
        assert.ok(Ember['default'].PromiseProxyMixin.detect(response), "response is a promise");
        response.then(function (result) {
            assert.ok(response.get("content") instanceof Foo, "response content is instace of Foo");
            start();
        });
    });

    asyncTest("__find single model with no id", function (assert) {
        var options = { data: { main: true } };

        response = localstorageadapter.find("foo", null, options, true);

        assert.equal(requestSpy.args[0][0], "sl-ember-store", "calls request with correct args");

        assert.ok(response.then, "response is a promise");

        assert.ok(Ember['default'].PromiseProxyMixin.detect(response), "response is a promise");

        response.then(function () {
            assert.ok(response.get("content") instanceof Foo, "response content is instace of Foo");
            start();
        });
    });

    asyncTest("__find array of models", function (assert) {
        var options = { data: { main: true } };

        response = localstorageadapter.find("bar", null, options, false);

        assert.ok(Ember['default'].PromiseProxyMixin.detect(response), "response is a promise");

        response.then(function () {
            assert.ok(response.get("content.0") instanceof Bar, "response content is instace of Bar");
            assert.ok(response.get("content.1") instanceof Bar, "response content is instace of Bar");
            start();
        });
    });

    asyncTest("save", function (assert) {
        var fooContent = { id: 2, test: "foo", bar: { id: 1, quiz: "bar2" } },
            foo = Foo.create(fooContent);

        response = localstorageadapter.save("/foo", foo);
        response.then(function () {
            var fooRecords = JSON.parse(localStorage.getItem("sl-ember-store")).foo,
                fooRecord = fooRecords.findBy("id", 2);

            assert.ok(response.then, "response is a promise");

            assert.equal(fooRecord.id, 2, "should have added the record to the mock ls object");
            start();
        });
    });

    asyncTest("delete", function (assert) {
        var fooContent = { id: 2, test: "foo", bar: { id: 1, quiz: "bar2" } },
            foo = Foo.create(fooContent),
            r = localstorageadapter.save("/foo", foo);

        r.then(function () {
            var response = localstorageadapter.deleteRecord("/foo", 2);

            response.then(function () {
                assert.ok(response.then, "response is a promise");

                var fooRecords = [JSON.parse(localStorage.getItem("sl-ember-store")).foo],
                    fooRecord = fooRecords.findBy("id", 2);

                assert.equal(fooRecord, undefined, "should have deleted the record to the mock ls object");
                start();
            });
        });
    });

    asyncTest("quota test", function (assert) {
        var fooContent = { id: 1, test: [] },
            foo,
            r;

        for (var i = 0; i < 10000000; i++) {
            fooContent.test[i] = "01000001000000000100010";
        }

        //make sure we actually test the browser's localstorage
        getLocalStorageSpy.restore();

        foo = Foo.create(fooContent);

        r = localstorageadapter.save("/foo", foo);

        r.then(function (result) {
            assert.ok(false, "Promise did not get rejected!");
            start();
        }, function (result) {
            assert.equal(result.textStatus, "error", "Promise gets rejected for exceeding quota");
            start();
        });
    });

});
define('dummy/tests/unit/adapters/localstorage-test.jshint', function () {

  'use strict';

  module('JSHint - unit/adapters');
  test('unit/adapters/localstorage-test.js should pass jshint', function() { 
    ok(true, 'unit/adapters/localstorage-test.js should pass jshint.'); 
  });

});
define('dummy/tests/unit/cache-test', ['ember', 'ember-qunit', 'sl-ember-store/cache'], function (Ember, ember_qunit, Cache) {

    'use strict';

    var cache, fetchByIdSpy, fetchOneSpy, _getManyPromiseSpy, _getRecordSpy;

    module("Unit - sl-ember-store/cache", {
        beforeEach: function () {
            cache = Cache['default'].create();
            fetchByIdSpy = sinon.spy(cache, "fetchById");
            fetchOneSpy = sinon.spy(cache, "fetchOne");
            _getManyPromiseSpy = sinon.spy(cache, "_getManyPromise");
            _getRecordSpy = sinon.spy(cache, "_getRecords");
        },
        afterEach: function () {
            fetchByIdSpy.restore();
            fetchOneSpy.restore();
            _getManyPromiseSpy.restore();
            _getRecordSpy.restore();
        }
    });

    ember_qunit.test("isCached, id", function (assert) {
        cache.isCached("test", 1);
        assert.ok(fetchByIdSpy.calledOnce, "fetch by id called once");
        assert.equal(fetchByIdSpy.args[0][1], 1, "fetch by the right id");
    });
    ember_qunit.test("isCached, one", function (assert) {
        cache.isCached("test", null, true);
        assert.ok(fetchOneSpy.calledOnce, "fetch one called once");
        assert.equal(fetchOneSpy.args[0][0], "test", "fetch one called with correct type");
    });
    ember_qunit.test("isCached, all", function (assert) {
        cache.isCached("test");
        assert.ok(_getManyPromiseSpy.calledOnce, "get all called once");
        assert.equal(_getManyPromiseSpy.args[0][0], "test", "get all called with correct type");
        assert.ok(_getRecordSpy.calledOnce, "get all called once");
        assert.equal(_getRecordSpy.args[0][0], "test", "get all called with correct type");
    });

    ember_qunit.test("clearCache", function (assert) {
        sinon.spy(cache, "_initializeRecords");
        sinon.spy(cache, "_initializePromises");
        cache.clearCache("test");
        assert.ok(cache._initializeRecords.calledOnce, "initialize records called once");
        assert.ok(cache._initializeRecords.calledWith("test"), "initialize records called with correct arg");
        assert.ok(cache._initializePromises.calledOnce, "initialize promises called once");
        assert.ok(cache._initializePromises.calledWith("test"), "initialize records called with correct arg");
    });

    ember_qunit.test("removeRecord", function (assert) {
        cache.removeRecord("test", Ember['default'].Object.create());
        assert.ok(cache._getRecords.calledOnce, "_getRecords called once");
        assert.ok(cache._getRecords.calledWith("test"), "_getRecords called with correct arg");
    });

    ember_qunit.test("removeRecords", function (assert) {
        sinon.spy(cache, "removeRecord");
        cache.removeRecords("test", [Ember['default'].Object.create()]);
        assert.ok(cache.removeRecord.calledOnce, "removeRecord called once");
        assert.ok(cache.removeRecord.calledWith("test"), "removeRecord called with correct arg");
    });

    ember_qunit.test("addToCache, single promise", function (assert) {
        var result = new Ember['default'].RSVP.Promise(function (resolve) {
            resolve(Ember['default'].Object.create());
        });
        sinon.spy(cache, "addPromise");
        cache.addToCache("test", 1, false, result);
        assert.ok(cache.addPromise.calledOnce, "addPromise called once");
        assert.ok(cache.addPromise.calledWith("test"), "addPromise called with correct args");
    });

    ember_qunit.test("addToCache, all promise", function (assert) {
        var result = new Ember['default'].RSVP.Promise(function (resolve) {
            resolve([Ember['default'].Object.create()]);
        });
        sinon.spy(cache, "addManyPromise");
        cache.addToCache("test", false, false, result);
        assert.ok(cache.addManyPromise.calledOnce, "addManyPromise called once");
        assert.ok(cache.addManyPromise.calledWith("test"), "addManyPromise called with correct args");
    });

    ember_qunit.test("addToCache, record", function (assert) {
        sinon.spy(cache, "addRecord");
        cache.addToCache("test", 1, false, Ember['default'].Object.create());
        assert.ok(cache.addRecord.calledOnce, "addRecord called once");
        assert.ok(cache.addRecord.calledWith("test"), "addRecord called with correct args");
    });

    asyncTest("addPromise, resolve", function (assert) {
        var testRecord = Ember['default'].Object.create({ id: 1, test: "test" }),
            testPromise = new Ember['default'].RSVP.Promise(function (resolve) {
            setTimeout(resolve(testRecord), 1000);
        }),
            rPromise;

        sinon.spy(cache, "_getPromises");

        rPromise = cache.addPromise("test", 1, testPromise);
        assert.ok(cache._getPromises.calledOnce, "_getPromises called once");
        assert.equal(cache.get("_promises.test.ids.1"), testPromise, "promise got added to promise cache");

        //test that promise gets removed from promise hash on resolution
        rPromise["finally"](function () {
            assert.equal(cache.get("_promises.test.ids.1"), undefined, "promise was removed from cache");
            assert.ok(cache._getRecords.calledOnce, "_getRecords called once");
            assert.equal(cache.get("_records.test.ids.1"), testRecord, "record was added to record cache");
            start();
        });
    });
    asyncTest("addPromise, reject", function (assert) {
        var testRecord = Ember['default'].Object.create({ id: 1, test: "test" }),
            testPromise = new Ember['default'].RSVP.Promise(function (resolve, reject) {
            setTimeout(reject(testRecord), 1000);
        }),
            rPromise;

        sinon.spy(cache, "_getPromises");

        rPromise = cache.addPromise("test", 1, testPromise);
        assert.ok(cache._getPromises.calledOnce, "_getPromises called once");
        assert.equal(cache.get("_promises.test.ids.1"), testPromise, "promise got added to promise cache");

        //test that promise gets removed from promise hash on resolution
        rPromise["finally"](function () {
            assert.equal(cache.get("_promises.test.ids.1"), undefined, "promise was removed from cache");
            assert.ok(!cache._getRecords.called, "_getRecords not called");
            assert.equal(cache.get("_records.test.ids.1"), undefined, "record was not added to record cache");
            start();
        });
    });


    asyncTest("addManyPromise, resolve", function (assert) {
        var testRecord = Ember['default'].Object.create({ id: 1, test: "test" }),
            testPromise = new Ember['default'].RSVP.Promise(function (resolve) {
            setTimeout(resolve([testRecord]), 100);
        }),
            rPromise;

        sinon.spy(cache, "_getPromises");
        sinon.spy(cache, "addRecords");

        rPromise = cache.addManyPromise("test", testPromise);
        assert.ok(cache._getPromises.called >= 1, "_getPromises called at least once");
        assert.equal(cache.get("_promises.test.many.firstObject"), testPromise, "promise was added to promise cache");
        rPromise.then(function () {
            assert.equal(cache.get("_promises.test.many.length"), 0, "promise was removed from promise cache");
            assert.ok(cache.addRecords.calledOnce, "addrecords called once");
            assert.equal(cache.get("_records.test.ids.1"), testRecord, "record was added to record cache");
            start();
        });
    });

    asyncTest("addManyPromise, reject", function (assert) {
        var testRecord = Ember['default'].Object.create({ id: 1, test: "test" }),
            testPromise = new Ember['default'].RSVP.Promise(function (resolve, reject) {
            setTimeout(reject([testRecord]), 100);
        }),
            rPromise;

        sinon.spy(cache, "_getPromises");
        sinon.spy(cache, "addRecords");

        rPromise = cache.addManyPromise("test", testPromise);
        assert.ok(cache._getPromises.called >= 1, "_getPromises called at least once");
        assert.equal(cache.get("_promises.test.many.firstObject"), testPromise, "promise was added to promise cache");
        rPromise["finally"](function () {
            assert.equal(cache.get("_promises.test.many.length"), 0, "promise was removed from promise cache");
            assert.ok(!cache.addRecords.calledOnce, "addrecords not called once");
            assert.equal(cache.get("_records.test.ids.1"), undefined, "record was added to record cache");
            start();
        });
    });

    ember_qunit.test("addRecord", function (assert) {
        var testRecord = Ember['default'].Object.create({ id: 1, test: "test" });
        var testRecord2 = Ember['default'].Object.create({ id: 1, test: "test2" });

        sinon.spy(cache, "removeRecord");

        cache.addRecord("test", testRecord);

        assert.equal(cache.get("_records.test.ids.1"), testRecord, "testRecord added to record cache");

        assert.ok(!cache.removeRecord.called, "removeRecord was not called on initial add");

        cache.addRecord("test", testRecord2);

        assert.ok(cache.removeRecord.called, "removeRecord was called on 2nd add");

        assert.equal(cache.get("_records.test.ids.1"), testRecord2, "testRecord2 replaced old record in cache");
    });

    ember_qunit.test("addRecords", function (assert) {
        var testRecord = Ember['default'].Object.create({ id: 1, test: "test" });
        var testRecord2 = Ember['default'].Object.create({ id: 2, test: "test2" });

        sinon.spy(cache, "addRecord");

        cache.addRecords("test", [testRecord, testRecord2]);

        assert.equal(cache.addRecord.callCount, 2, "addRecord called for each record");
    });

    ember_qunit.test("fetch, id", function (assert) {
        cache.fetch("test", 1);
        assert.ok(fetchByIdSpy.calledOnce, "fetch by id called once");
        assert.equal(fetchByIdSpy.args[0][1], 1, "fetch by the right id");
    });
    ember_qunit.test("fetch, one", function (assert) {
        cache.fetch("test", null, true);
        assert.ok(fetchOneSpy.calledOnce, "fetch one called once");
        assert.equal(fetchOneSpy.args[0][0], "test", "fetch one called with correct type");
    });
    ember_qunit.test("fetch, all", function (assert) {
        cache.fetch("test");
        assert.ok(_getManyPromiseSpy.calledOnce, "get all called once");
        assert.equal(_getManyPromiseSpy.args[0][0], "test", "get all called with correct type");
        assert.ok(_getRecordSpy.calledOnce, "get all called once");
        assert.equal(_getRecordSpy.args[0][0], "test", "get all called with correct type");
    });


    asyncTest("fetchOne - promise", function (assert) {
        var testRecord = Ember['default'].Object.create({ id: 1 });

        cache.addPromise("test", 1, Ember['default'].RSVP.Promise.resolve(testRecord)).then(function () {
            sinon.spy(cache, "_getPromises");

            var response = cache.fetchOne("test");

            assert.ok(cache._getPromises.calledOnce, "getPromise called once");

            response.then(function () {
                assert.equal(response.get("content"), testRecord, "fetchOne returned correct record");

                start();
            });
        });
    });

    asyncTest("fetchOne - record", function (assert) {
        var testRecord = Ember['default'].Object.create({ id: 1 });

        cache.addRecord("test", testRecord);

        var response = cache.fetchOne("test");

        assert.ok(cache._getRecords.called, "getRecords called once");

        response.then(function () {
            assert.equal(response.get("content"), testRecord, "fetchOne returned the correct record");
            start();
        });
    });


    asyncTest("fetchById - promise", function (assert) {
        var testRecord = Ember['default'].Object.create({ id: 1 });

        cache.addPromise("test", 1, Ember['default'].RSVP.Promise.resolve(testRecord)).then(function () {
            sinon.spy(cache, "_getPromiseById");

            var response = cache.fetchById("test", 1);

            assert.ok(cache._getPromiseById.calledOnce, "getPromiseById called once");

            response.then(function () {
                assert.equal(response.get("content"), testRecord, "fetchById returned correct record");

                start();
            });
        });
    });

    asyncTest("fetchById - record", function (assert) {
        var testRecord = Ember['default'].Object.create({ id: 1 });

        cache.addRecord("test", testRecord);

        sinon.spy(cache, "_getRecordById");

        var response = cache.fetchById("test", 1);

        assert.ok(cache._getRecordById.calledOnce, "getRecordById called once");

        response.then(function () {
            assert.equal(response.get("content"), testRecord, "fetchById returned correct record");

            start();
        });
    });

    ember_qunit.test("fetchMany - promise", function (assert) {
        var testRecord = Ember['default'].Object.create({ id: 1 });
        var testPromise = Ember['default'].RSVP.Promise.resolve([testRecord]);

        cache.addManyPromise("test", testPromise);
        var response = cache.fetchMany("test");
        assert.ok(cache._getManyPromise.calledOnce, "calls _getManyPromise once");
        assert.ok(response, testPromise, "returns the test promise");
    });

    asyncTest("fetchMany - record", function (assert) {
        var testRecord = Ember['default'].Object.create({ id: 1 });
        cache.addRecords("test", [testRecord]);
        var response = cache.fetchMany("test");
        assert.ok(cache._getRecords.called, "calls _getManyRecordsCached once");
        response.then(function () {
            assert.equal(response.get("content.0"), testRecord, "returns the test record in an array");
            start();
        });
    });

    ember_qunit.test("_setupCache", function (assert) {
        cache._setupCache();
        assert.equal(Object.keys(cache._records).length, 0, "records object is empty");
        assert.equal(Object.keys(cache._promises).length, 0, "promises object is empty");
    });

    ember_qunit.test("_initializeRecords", function (assert) {
        cache._initializeRecords("test");
        assert.equal(cache._records.test.records.length, 0, "sets up `test` records array");
        assert.ok(cache._records.test.ids instanceof Ember['default'].Object, "sets up `test` records object");
    });

    ember_qunit.test("_getRecords, none", function (assert) {
        var response = cache._getRecords("test");
        assert.equal(response.records.length, 0, "returns 0 records");
    });

    ember_qunit.test("_getRecords, some", function (assert) {
        cache.addRecord("test", Ember['default'].Object.create({ id: 1 }));
        var response = cache._getRecords("test");
        assert.equal(response.records[0].id, 1, "returns an array with the test record");
    });

    ember_qunit.test("_getRecordById, not found", function (assert) {
        var response = cache._getRecordById("test", 12);
        assert.equal(response, undefined, "record should not be found");
    });

    ember_qunit.test("_getRecordById, found", function (assert) {
        var testRecord = Ember['default'].Object.create({ id: 1 });
        cache.addRecord("test", testRecord);
        var response = cache._getRecordById("test", 1);
        assert.equal(response, testRecord, "returns the correct record");
    });

    ember_qunit.test("_getRecords, empty", function (assert) {
        var response = cache._getRecords("test").records;
        assert.equal(response.length, 0, "returns an empty array");
    });

    ember_qunit.test("_getRecords, some", function (assert) {
        var testRecord = Ember['default'].Object.create({ id: 1 });
        cache.addRecord("test", testRecord);
        var response = cache._getRecords("test").records;
        assert.equal(response[0], testRecord, "returns the test record in an array");
    });

    ember_qunit.test("_initializePromises", function (assert) {
        cache._initializePromises("test");
        assert.equal(cache._promises.test.many.firstObject, null, "test all promise is null ");
        assert.equal(Object.keys(cache._promises.test.ids).length, 0, "test promise object is empty");
    });

    ember_qunit.test("_getPromises, empty", function (assert) {
        sinon.spy(cache, "_initializePromises");
        var response = cache._getPromises("test");
        assert.ok(cache._initializePromises.calledOnce, "calls initializePromises");
    });

    ember_qunit.test("_getPromises, some", function (assert) {
        var testPromise = Ember['default'].RSVP.Promise.resolve(Ember['default'].Object.create({ id: 1 }));
        cache.addPromise("test", 1, testPromise);
        var response = cache._getPromises("test");
        assert.equal(response.ids[1], testPromise, "has testpromise set");
    });

    ember_qunit.test("_getPromiseById, none", function (assert) {
        var response = cache._getPromiseById("test", 1);
        assert.equal(response, undefined, "no promise should be found");
    });
    ember_qunit.test("_getPromiseById, some", function (assert) {
        var testPromise = Ember['default'].RSVP.Promise.resolve(Ember['default'].Object.create({ id: 1 }));
        cache.addPromise("test", 1, testPromise);
        var response = cache._getPromiseById("test", 1);
        assert.equal(response, testPromise, "promise should be found");
    });

    ember_qunit.test("_getManyPromise, none", function (assert) {
        var response = cache._getManyPromise("test");
        assert.equal(response, undefined, "response should be undefined");
    });
    asyncTest("_getManyPromise, some", function (assert) {
        var testRecord = Ember['default'].Object.create({ id: 1 }),
            testPromise = Ember['default'].RSVP.Promise.resolve([testRecord]);

        cache.addManyPromise("test", testPromise);

        var response = cache._getManyPromise("test");

        response.then(function (records) {
            assert.equal(testRecord, records[0], "should return promise");
            start();
        });
    });

    asyncTest("_getManyPromise, more", function (assert) {
        var testRecord = Ember['default'].Object.create({ id: 1 }),
            testRecord2 = Ember['default'].Object.create({ id: 2 }),
            testPromise = Ember['default'].RSVP.Promise.resolve([testRecord]),
            testPromise2 = Ember['default'].RSVP.Promise.resolve([testRecord2]);

        cache.addManyPromise("test", testPromise);
        cache.addManyPromise("test", testPromise2);

        var response = cache._getManyPromise("test");

        response.then(function (records) {
            assert.equal(testRecord, records[0], "first record should be testRecord");
            assert.equal(testRecord2, records[1], "first record should be testRecord");
            start();
        });
    });

});
define('dummy/tests/unit/cache-test.jshint', function () {

  'use strict';

  module('JSHint - unit');
  test('unit/cache-test.js should pass jshint', function() { 
    ok(true, 'unit/cache-test.js should pass jshint.'); 
  });

});
define('dummy/tests/unit/initializers/sl-ember-model-test', ['ember', 'ember-qunit', 'dummy/tests/helpers/start-app', 'sl-ember-store/store', 'sl-ember-store/adapters/ajax', 'sl-ember-store/adapters/localstorage'], function (Ember, ember_qunit, startApp, Store, AjaxAdapter, LocalstorageAdapter) {

    'use strict';

    var App, container;

    module("Unit - initializer: sl-ember-store", {
        beforeEach: function () {
            App = startApp['default']();
            container = App.__container__;
        },

        afterEach: function () {
            Ember['default'].run(App, App.destroy);
        }
    });

    ember_qunit.test("LocalStorage adapter gets namespace set", function (assert) {
        var lsAdapter = container.lookupFactory("adapter:localstorage");
        assert.equal(lsAdapter.namespace, container.lookup("application:main").get("modulePrefix"));
    });

    ember_qunit.test("store:main gets registered", function (assert) {
        var store = container.lookupFactory("store:main");
        assert.ok(Store['default'].detect(store));
    });

    ember_qunit.test("adapter:ajax gets registered", function (assert) {
        var ajaxAdapter = container.lookupFactory("adapter:ajax");
        assert.ok(AjaxAdapter['default'].detect(ajaxAdapter));
    });

    ember_qunit.test("adapter:localstorage gets registered", function (assert) {
        var lsAdapter = container.lookupFactory("adapter:localstorage");
        assert.ok(LocalstorageAdapter['default'].detect(lsAdapter));
    });

    ember_qunit.test("store gets injected into controllers, routes, adapters", function (assert) {
        var appRoute = container.lookup("route:demos/single-model"),
            appController,
            ajaxAdapter = container.lookup("adapter:ajax"),
            store = container.lookup("store:main");

        assert.expect(3);

        assert.equal(appRoute.get("store"), store);
        assert.equal(ajaxAdapter.get("store"), store);

        visit("/").then(function () {
            appController = container.lookup("controller:application");
            assert.equal(appController.get("store"), store);
        });
    });

});
define('dummy/tests/unit/initializers/sl-ember-model-test.jshint', function () {

  'use strict';

  module('JSHint - unit/initializers');
  test('unit/initializers/sl-ember-model-test.js should pass jshint', function() { 
    ok(true, 'unit/initializers/sl-ember-model-test.js should pass jshint.'); 
  });

});
define('dummy/tests/unit/model-test', ['ember', 'ember-qunit', 'dummy/models/foo', 'dummy/models/bar', 'sl-ember-store/model'], function (Ember, ember_qunit, Foo, Bar, Model) {

    'use strict';

    var foo,
        bar,
        adapter,
        container,
        fooResponse = { id: 1, test: "true" },
        ajaxMock = function () {
        return new Ember['default'].RSVP.Promise(function (resolve) {
            resolve(fooResponse);
        });
    },
        serRespons1 = { test: true },
        serResponse2 = { test: false },
        serializer1 = function (response, store) {
        return response;
    },
        serializer2 = function (response, store) {
        return response;
    },
        testResponse1 = { test: true },
        testResponse2 = { test: false },
        TestModel = Model['default'].extend({});
    TestModel.reopenClass({
        serializer: function (response, store) {
            return testResponse1;
        },
        endpoints: {
            test: {
                get: {
                    serializer: function (response, store) {
                        return testResponse2;
                    }
                }
            }
        }
    });

    module("Unit - sl-ember-store/model", {
        beforeEach: function () {
            Foo['default'].reopenClass({
                url: "/foo",
                endpoints: {
                    doo: {
                        url: "/doo"
                    },
                    goo: {
                        serializer: serializer1,
                        post: {
                            url: "/goo",
                            serializer: serializer2
                        }
                    }
                }
            });

            Bar['default'].reopenClass({
                url: "/bar",
                endpoints: {
                    "default": {
                        post: "/barUpdate",
                        "delete": "/barDelete",
                        serializer: serializer1
                    },
                    car: {
                        post: {
                            url: "/carUpdate",
                            serializer: serializer2 },
                        "delete": "/carDelete"
                    }
                }
            });

            adapter = {
                save: ajaxMock,
                deleteRecord: ajaxMock };

            sinon.spy(adapter, "save");
            sinon.spy(adapter, "deleteRecord");

            container = {
                registry: [],
                cache: {},
                normalize: function (key) {
                    return key;
                },
                lookup: function (key) {
                    if (this.cache[key]) return this.cache[key];

                    var obj = this.registry.findBy("key", key).factory.create({ container: this });
                    this.cache[key] = obj;
                    return obj;
                },
                lookupFactory: function (key) {
                    var item = this.registry.findBy("key", key);
                    return item ? item.factory : undefined;
                }
            };

            container.cache["adapter:ajax"] = adapter;

            foo = Foo['default'].create({
                content: {
                    test: "foo",
                    bar: { id: 1, quiz: "bar" } },
                container: container
            });


            bar = Bar['default'].create({
                content: {
                    test: "bar",
                    car: { id: 1, quiz: "car" } },
                container: container
            });
        },
        afterEach: function () {
            adapter.save.reset();
            adapter.deleteRecord.reset();
            foo = Foo['default'].create({
                content: {
                    test: "foo",
                    bar: { id: 1, quiz: "bar" } },
                container: container
            });
            bar = Bar['default'].create({
                content: {
                    test: "bar",
                    car: { id: 1, quiz: "car" } },
                container: container
            });
        }
    });

    ember_qunit.test("getUrlForEndpointAction:should return /bar for ( null, `get` )", function (assert) {
        assert.equal(Bar['default'].getUrlForEndpointAction(null, "get"), "/bar");
    });

    ember_qunit.test("getUrlForEndpointAction:should return /barUpdate for ( null, `post` )", function (assert) {
        assert.equal(Bar['default'].getUrlForEndpointAction(null, "post"), "/barUpdate");
    });

    ember_qunit.test("getUrlForEndpointAction:should return /barDelete for ( null, `delete` )", function (assert) {
        assert.equal(Bar['default'].getUrlForEndpointAction(null, "delete"), "/barDelete");
    });

    ember_qunit.test("getUrlForEndpointAction:should return /bar for ( `default`, `get` )", function (assert) {
        assert.equal(Bar['default'].getUrlForEndpointAction("default", "get"), "/bar");
    });

    ember_qunit.test("getUrlForEndpointAction:should return /barUpdate for ( `default`, `post` )", function (assert) {
        assert.equal(Bar['default'].getUrlForEndpointAction("default", "post"), "/barUpdate");
    });

    ember_qunit.test("getUrlForEndpointAction:should return /barDelete for ( `default`, `delete` )", function (assert) {
        assert.equal(Bar['default'].getUrlForEndpointAction("default", "delete"), "/barDelete");
    });

    ember_qunit.test("getUrlForEndpointAction:should return /bar for ( `car`, `get` )", function (assert) {
        assert.equal(Bar['default'].getUrlForEndpointAction("car", "get"), "/bar");
    });

    ember_qunit.test("getUrlForEndpointAction:should return /carUpdate for ( `car`, `post` )", function (assert) {
        assert.equal(Bar['default'].getUrlForEndpointAction("car", "post"), "/carUpdate");
    });

    ember_qunit.test("getUrlForEndpointAction:should return /carDelete for ( `car`, `delete` )", function (assert) {
        assert.equal(Bar['default'].getUrlForEndpointAction("car", "delete"), "/carDelete");
    });

    ember_qunit.test("callSerializerForEndpointAction:should return testResponse1 for TestModel - ( `null`, `get` ) ", function (assert) {
        var testResponse = TestModel.callSerializerForEndpointAction(null, "get", {});
        assert.equal(testResponse, testResponse1);
    });

    ember_qunit.test("callSerializerForEndpointAction:should return testResponse1 for TestModel - ( `test`, `get` ) ", function (assert) {
        var testResponse = TestModel.callSerializerForEndpointAction("test", "get", {});
        assert.equal(testResponse, testResponse2);
    });

    ember_qunit.test("save-default:should call adapter.save with correct arguments", function (assert) {
        assert.expect(2);
        foo.save().then(function () {
            assert.equal(adapter.save.args[0][0], "/foo");
            assert.equal(adapter.save.args[0][1].test, "foo");
        });
    });

    ember_qunit.test("save-default:should update its content with fooResponse", function (assert) {
        assert.expect(1);
        foo.save().then(function () {
            assert.deepEqual(foo.get("content"), fooResponse);
        });
    });

    ember_qunit.test("save-endpoint:should call adapter.save with correct arguments", function (assert) {
        assert.expect(2);
        bar.save().then(function () {
            assert.equal(adapter.save.args[0][0], "/barUpdate");
            assert.equal(adapter.save.args[0][1].test, "bar");
        });
    });
    ember_qunit.test("save-endpoint:should update its content with fooResponse", function (assert) {
        assert.expect(1);
        bar.save().then(function () {
            assert.deepEqual(bar.get("content"), fooResponse);
        });
    });

    ember_qunit.test("save-endpoint:car: should call adapter.save with correct arguments", function (assert) {
        assert.expect(2);
        bar = Bar['default'].create({
            content: {
                test: "bar",
                car: { id: 1, quiz: "car" } },
            container: container
        });
        bar.save({ endpoint: "car" }).then(function () {
            assert.equal(adapter.save.args[0][0], "/carUpdate");
            assert.equal(adapter.save.args[0][1].test, "bar");
        });
    });

    ember_qunit.test("save-endpoint:car: should update its content with fooResponse", function (assert) {
        bar = Bar['default'].create({
            content: {
                test: "bar",
                car: { id: 1, quiz: "car" } },
            container: container
        });
        bar.save({ endpoint: "car" }).then(function () {
            assert.deepEqual(bar.get("content"), fooResponse);
        });
    });

    ember_qunit.test("delete: should call adapter.deleteRecord with correct arguments", function (assert) {
        assert.expect(1);
        foo.deleteRecord().then(function () {
            assert.ok(adapter.deleteRecord.calledWith("/foo"));
        });
    });

    ember_qunit.test("delete: should destroy foo", function (assert) {
        assert.expect(1);
        foo.deleteRecord().then(function () {
            assert.ok(foo.isDestroyed);
        });
    });

    ember_qunit.test("delete-endpoint: should call adapter.delete with correct arguments", function (assert) {
        assert.expect(1);
        bar.deleteRecord().then(function () {
            assert.ok(adapter.deleteRecord.calledWith("/barDelete"));
        });
    });

    ember_qunit.test("delete-endpoint: should destroy bar", function (assert) {
        assert.expect(1);
        bar.deleteRecord().then(function () {
            assert.ok(bar.isDestroyed);
        });
    });

    ember_qunit.test("delete-endpoint:car: should call adapter.delete with correct arguments", function (assert) {
        assert.expect(1);
        bar.deleteRecord({ endpoint: "car" }).then(function () {
            assert.ok(adapter.deleteRecord.calledWith("/carDelete"));
        });
    });

    ember_qunit.test("delete-endpoint:car: should destroy bar", function (assert) {
        assert.expect(1);
        bar.deleteRecord({ endpoint: "car" }).then(function () {
            assert.ok(bar.isDestroyed);
        });
    });

});
define('dummy/tests/unit/model-test.jshint', function () {

  'use strict';

  module('JSHint - unit');
  test('unit/model-test.js should pass jshint', function() { 
    ok(true, 'unit/model-test.js should pass jshint.'); 
  });

});
define('dummy/tests/unit/store-test', ['ember', 'ember-qunit', 'sl-ember-store/store', 'sl-ember-store/model'], function (Ember, ember_qunit, Store, Model) {

    'use strict';

    var Foo, Bar, store, AjaxAdapter, ajaxAdapter, LocalstorageAdapter, queryHook;

    module("Unit - sl-ember-store/store", {

        beforeEach: function () {
            Foo = Model['default'].extend();
            Bar = Model['default'].extend();
            Bar.reopenClass({ adapter: "localstorage" });

            AjaxAdapter = Ember['default'].Object.extend({
                type: "ajax",
                __find: function () {},
                find: function () {
                    return Ember['default'].RSVP.resolve([Ember['default'].Object.create()]);
                }
            });

            LocalstorageAdapter = Ember['default'].Object.extend({ type: "localstorage" });

            store = Store['default'].create({
                container: {
                    registry: [],
                    cache: {},
                    normalize: function (key) {
                        return key;
                    },
                    lookup: function (key) {
                        if (this.cache[key]) return this.cache[key];

                        var obj = this.registry.findBy("key", key).factory.create({ container: this });
                        this.cache[key] = obj;
                        return obj;
                    },
                    lookupFactory: function (key) {
                        return this.registry.findBy("key", key).factory;
                    }
                }
            });
            store.container.registry.push({ key: "adapter:ajax", factory: AjaxAdapter });
            store.container.registry.push({ key: "adapter:localstorage", factory: LocalstorageAdapter });

            store.container.registry.push({ key: "model:foo", factory: Foo });
            store.container.registry.push({ key: "model:bar", factory: Bar });

            ajaxAdapter = store.container.lookup("adapter:ajax");


            //sinon spies
            sinon.spy(store, "__find");
            sinon.spy(store, "modelFor");
            sinon.spy(store, "adapterFor");
            sinon.spy(ajaxAdapter, "find");
            sinon.spy(Foo, "create");
            queryHook = sinon.spy();
        },
        afterEach: function () {
            store.__find.restore();
            store.modelFor.restore();
            store.adapterFor.restore();
            ajaxAdapter.find.restore();
            Foo.create.restore();
            queryHook.reset();
        }
    });

    ember_qunit.test("modelFor: should return the model \"Foo\" for type \"foo\" ", function (assert) {
        assert.ok(store.modelFor("foo") === Foo);
    });

    ember_qunit.test("modelFor: should return the model \"Bar\" for type \"bar\" ", function (assert) {
        assert.ok(store.modelFor("bar") === Bar);
    });

    ember_qunit.test("adapterFor: should return the adapter ajax for model type foo", function (assert) {
        assert.ok(store.adapterFor("foo") instanceof AjaxAdapter);
    });

    ember_qunit.test("adapterFor: should return the adapter localstorage for model type bar", function (assert) {
        assert.ok(store.adapterFor("bar") instanceof LocalstorageAdapter);
    });

    ember_qunit.test("findOne: should call __find with correct args", function (assert) {
        var options = { otherId: 1 },
            args;

        store.findOne("foo", options);

        assert.ok(store.__find.calledWith("foo", null, options, true));
    });

    ember_qunit.test("find should call __find with numeric id", function (assert) {
        var options = { otherId: 1 };
        store.find("foo", 1, options);
        assert.ok(store.__find.calledWith("foo", 1, options, false));
    });

    ember_qunit.test("find should call __find with object for first param", function (assert) {
        var options = { otherId: 1 };
        store.find("foo", options);
        assert.ok(store.__find.calledWith("foo", null, options, false));
    });

    ember_qunit.test("find should call __find with only the type", function (assert) {
        store.find("foo");
        assert.ok(store.__find.calledWith("foo", null, null, false));
    });

    ember_qunit.test("__find should have called modelFor", function (assert) {
        store.__find("foo", 1, {}, false);
        assert.ok(store.modelFor.calledWith("foo"));
    });

    ember_qunit.test("__find should have called adapterFor", function (assert) {
        store.__find("foo", 1, {}, false);
        assert.ok(store.adapterFor.calledWith("foo"));
    });

    ember_qunit.test("__find should have called AjaxAdapter.find", function (assert) {
        store.__find("foo", 1, {}, false);
        assert.ok(ajaxAdapter.find.calledWith("foo", 1, {}, false));
    });

    ember_qunit.test("createRecord should have called modelFor", function (assert) {
        store.createRecord("foo");
        assert.ok(store.modelFor.calledWith("foo"));
    });

    ember_qunit.test("createRecord should have called Foo.create once", function (assert) {
        store.createRecord("foo");
        assert.ok(Foo.create.calledOnce);
    });

    ember_qunit.test("createRecord should have called Foo.create with an object container", function (assert) {
        store.createRecord("foo");
        assert.ok(Foo.create.calledWith({ container: store.container }));
    });

    ember_qunit.test("registerPreQueryHook should add an entry to preQueryHooks", function (assert) {
        store.registerPreQueryHook(queryHook);
        assert.ok(store.get("preQueryHooks").length === 1);
    });

    ember_qunit.test("runPreQueryHooks should run query hook once", function (assert) {
        store.registerPostQueryHook(queryHook);
        store.runPostQueryHooks();
        assert.ok(queryHook.calledOnce);
    });

});
define('dummy/tests/unit/store-test.jshint', function () {

  'use strict';

  module('JSHint - unit');
  test('unit/store-test.js should pass jshint', function() { 
    ok(true, 'unit/store-test.js should pass jshint.'); 
  });

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('dummy/config/environment', ['ember'], function(Ember) {
  var prefix = 'dummy';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("dummy/tests/test-helper");
} else {
  require("dummy/app")["default"].create({"name":"sl-ember-store","version":"0.7.0.0d257029"});
}

/* jshint ignore:end */
//# sourceMappingURL=dummy.map