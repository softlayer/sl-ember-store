
module.exports = {
    description: 'Generates a model.',
    locals: function( options ){
        var locals  = {},
            url     = options.entity.options.url,
            adapter = options.entity.options.adapter;

        return {
            url: url ? "url    : '" + url + "'" + ( adapter ? ',' : '' ) : '',
            adapter: adapter ? "\n    adapter: '" + adapter + "'" : ''
        };
    }
};
