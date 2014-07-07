import SlModel from 'sl-model';

var <%= classifiedModuleName %> = SlModel.extend();

<%= classifiedModuleName %>.reopenClass({
    url: '<%= url %>',
    endpoints: {
    }
});

export default Device;