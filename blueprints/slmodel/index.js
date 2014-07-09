
module.exports = {
    locals: function( options ){
        var locals  = {},
            url     = options.entity.options.url,
            adpater = options.entity.options.adapter;

        return {
            url: url ? url : "'';throw 'Please add a URL to model: "+entity.name+"';",
            adpater: adapter ? adapter : "ajax"
        }
    }
};
