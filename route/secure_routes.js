express = require('express');
apiRoutes = express.Router();

// GET(http://localhost:8000/api/)
apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to API routing'});
});

apiRoutes.post('/deleteuser', (req, res) => {
  
});

// GET(http://localhost:8000/api/users)
apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    if (err) throw err;
    res.json(users);
  });
});

module.exports = apiRoutes;