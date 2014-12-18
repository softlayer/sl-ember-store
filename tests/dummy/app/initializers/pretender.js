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

    },
    {
        id: 4,
        text: 'This is foo record with id: 4',
        bar: {
            id: 4,
            text: 'This is a bar record with id: 4'
        }
    },
    {
        id: 5,
        text: 'This is foo record #5',
        bar: {
            id: 5,
            text: 'This is a bar record with id: 5'
        }

    },
    {
        id: 6,
        text: 'This is foo record #6',
        bar: {
            id: 6,
            text: 'This is a bar record with id: 6'
        }

    }
];

export function initialize(/* container, application */) {
    new Pretender(function(){
        this.get( '/foo', function(request){
            var id = request.queryParams.id && ( parseInt( request.queryParams.id ) - 1 ),
                start = request.queryParams.start || 0,
                length = request.queryParams.length || fooRecords.length,
                results = fooRecords.slice( start, length );

            if( request.queryParams.id ){
                return [
                    200,
                    { "Content-Type":"application/json" },
                    JSON.stringify( { foo: fooRecords[ id ] } )
                ];
            }

            return [
                200,
                { "Content-Type":"application/json" },
                JSON.stringify( { foo: results, meta: { total: fooRecords.length } })
            ];
        });
        this.post( '/foo', function(request){
            var record = JSON.parse( request.requestBody );
            fooRecords[ record.id ]= record;
            return [
                200,
                { "Content-Type":"application/json" },
                JSON.stringify( record )
            ];
        });
    });
}

export default {
  name: 'pretender',
  after: 'sl-ember-store',
  initialize: initialize
};
