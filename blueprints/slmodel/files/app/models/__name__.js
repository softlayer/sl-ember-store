import SlModel from 'sl-model';

var <%= classifiedModuleName %> = SlModel.extend();

<%= classifiedModuleName %>.reopenClass({
    url: '<%= url %>',
    adapter: '<%= adapter %>'
});

export default <%= classifiedModuleName %>;