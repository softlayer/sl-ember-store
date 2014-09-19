module.exports = function(app) {
  var express = require('express');
  var testApiRouter = express.Router();
  testApiRouter.get('/', function(req, res) {
    res.send({"test":[
        {
            id: 1,
            name: 'test1'
        },
        {
            id: 2,
            name: 'test2'
        },
        {
            id: 3,
            name: 'test3'
        }
    ]});
  });
  app.use('/api/test', testApiRouter);
};
