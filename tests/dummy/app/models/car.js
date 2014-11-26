import SlEmberModel from 'sl-ember-model/model';

var Car = SlEmberModel.extend({
});

Car.reopenClass({
    url: '/api/car',
    serializer: function( result ){
        return result.car;
    }
});

export default Car;
