import Model from "./model";
import Store from "./store";
import Adapter from "./adapter";
import AjaxAdapter from "./adapters/ajax";
import LocalstorageAdapter from "./adapters/localstorage";


/**
 * SL-Model exports sl-model/model as its default export.
 *
 * This allows you to do:
 *
 * ```javascript
 * import SlModel from 'sl-model'
 *
 * export default SlModel.extend({})
 *```
 * In your model files.
 *
 * @class sl-model
 */
export default Model;

export {
    Model as Model,
    Store as store,
    Adapter as adapter,
    AjaxAdapter as ajaxAdapter,
    LocalstorageAdapter as localstorageAdapter
};