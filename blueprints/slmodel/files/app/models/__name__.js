import SlModel from 'sl-model';

var <%= classifiedModuleName %> = SlModel.extend({

});

<%= classifiedModuleName %>.reopenClass({
    <%= url %><%= adapter %>
});

export default <%= classifiedModuleName %>;