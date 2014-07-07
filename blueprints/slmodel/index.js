var Blueprint = require('ember-cli/lib/models/blueprint');

module.exports = Blueprint.extend({
    locals: function( options ){
        return {
            url: options.entity.options.url,
            needs: options.entity.options.needs
        }
    }
});
