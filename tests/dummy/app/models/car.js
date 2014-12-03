import Model from 'sl-ember-store/model';

var Car = Model.extend({
});

Car.reopenClass({
    url: '/api/car',
    serializer: function( result ){
        return result.car;
    }
});

export default Car;
