const router = require('express').Router();
const users = require('./user-routes');

router.use('/users', users);

// router.get('/', (req, res) => {
//   res.send(`API WORKING`);
// });

module.exports = router;
