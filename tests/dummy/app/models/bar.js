import SlModel from 'sl-model/model';

var Bar = SlModel.extend({
});

Bar.reopenClass({
    adapter: 'localstorage',
    url: '/api/bar',
    serializer: function( result ){
        return result.bar;
    }
});

export default Bar;
