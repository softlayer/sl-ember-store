module.exports = function(app) {
  var express = require('express');
  var fooApiRouter = express.Router();
  fooApiRouter.get('/', function(req, res) {
    res.send({"foo":[
        {
            id: 1,
            name: 'fighters',
            bar: {
                id: 2,
                name: 'cheers2'
            }
        }
    ]});
  });
  app.use('/api/foo', fooApiRouter);
};
