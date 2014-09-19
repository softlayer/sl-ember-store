import SlModel from 'sl-model/model';

var Test = SlModel.extend({
    log: function( msg ){ console.log( msg, this ); }
});

Test.reopenClass({
    url: '/api/test',
    serializer: function( result ){
        return result.test;
    }
});

export default Test;
