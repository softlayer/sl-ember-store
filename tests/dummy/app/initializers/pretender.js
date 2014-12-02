import Pretender from 'pretender';

var fooRecords = [
    {
        id: 1,
        text: 'This is foo record with id: 1',
        bar: {
            id: 1,
            text: 'This is a bar record with id: 1'
        }
    },
    {
        id: 2,
        text: 'This is foo record #2',
        bar: {
            id: 2,
            text: 'This is a bar record with id: 2'
        }

    },
    {
        id: 3,
        text: 'This is foo record #3',
        bar: {
            id: 3,
            text: 'This is a bar record with id: 3'
        }

    }
];

export function initialize(/* container, application */) {
    new Pretender(function(){
        this.get( '/foo', function(request){
            var id = request.queryParams.id && ( parseInt( request.queryParams.id ) - 1 );

            if( request.queryParams.id ){
                return [
                    200,
                    { "Content-Type":"application/json" },
                    JSON.stringify( fooRecords[ id ] )
                ];
            }

            return [
                200,
                { "Content-Type":"application/json" },
                JSON.stringify( fooRecords )
            ];
            });
    });
}

export default {
  name: 'pretender',
  after: 'sl-ember-store',
  initialize: initialize
};
