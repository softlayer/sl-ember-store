import SlEmberModel from 'sl-ember-model/model';

var <%= classifiedModuleName %> = SlEmberModel.extend({

});

<%= classifiedModuleName %>.reopenClass({
    <%= url %><%= adapter %>
});

export default <%= classifiedModuleName %>;
