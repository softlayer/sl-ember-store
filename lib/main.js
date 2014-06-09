import Model from "./model";
import Adapter from "./adapter";
import Store from "./store";

import AjaxAdapter from "./adapters/ajax";
import LocalstorageAdapter from "./adapters/localstorage";

import Initializer from "./initializer.js";

Ember.Application.initializer(Initializer);

Ember.libraries.register("Interface-model", "0.0.1");

export default Model;