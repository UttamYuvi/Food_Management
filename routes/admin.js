var express = require('express');
var pool = require('./pool');
var router = express.Router();
var LocalStorage=require("node-localstorage").LocalStorage
var localstorage = new LocalStorage('./scratch')

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('login',{msg:''});
});

router.get('/logout', function(req, res, next) {
  localstorage.clear()
  res.render('login',{msg:''});
});

router.post('/checkadminlogin', function(req, res, next) {

  pool.query('select * from admins where (emailid=? or mobileno=?) and password=?',[req.body.id,req.body.id,req.body.password],function(error,result){

    if(error) {
      res.render("login",{msg:'SERVER ERROR..'});
    }
    else {

      if(result.length==1) {
        localstorage.setItem('admin',JSON.stringify(result))
        res.render("Dashbord",{result});
      }

      else{
        res.render("login",{msg:'Invalide ID/Password..'});
      }
    }

  });
  
});


module.exports = router;
