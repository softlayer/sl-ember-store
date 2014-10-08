module.exports = function(app) {
  var express = require('express');
  var carApiRouter = express.Router();
  carApiRouter.get('/', function(req, res) {
    res.send({"car":[
        {
            id: 1,
            name: 'ford'
        },
        {
            id: 2,
            name: 'chevy'
        },
        {
            id: 3,
            name: 'lambo'
        }
    ]});
  });
  app.use('/api/car', carApiRouter);
};
