import SlEmberModel from 'sl-ember-store/model';

var <%= classifiedModuleName %> = SlEmberModel.extend({

});

<%= classifiedModuleName %>.reopenClass({
    <%= url %><%= adapter %>
});

export default <%= classifiedModuleName %>;
