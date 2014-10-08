module.exports = function(app) {
  var express = require('express');
  var barApiRouter = express.Router();
  barApiRouter.get('/', function(req, res) {
    res.send({"bar":[
        {
            id: 1,
            name: 'cheers'
        }
    ]});
  });
  app.use('/api/bar', barApiRouter);
};
