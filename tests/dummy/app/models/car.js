import SlModel from 'sl-model/model';

var Car = SlModel.extend({
});

Car.reopenClass({
    url: '/api/car',
    serializer: function( result ){
        return result.car;
    }
});

export default Car;
