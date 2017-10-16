const express = require('express');
const router = express.Router();

router.get('/api', function(req, res, next){
    const user = {
      code:200,
      data: {
        name:'test',
        content:'这是内容'
      }
    };
    res.status(200).send(user).end();
});
module.exports = router;
