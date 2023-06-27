var express = require('express');
var router = express.Router();
var pool = require("./pool");
var upload = require("./multer");
var LocalStorage=require("node-localstorage").LocalStorage
var localstorage = new LocalStorage('./scratch')

// get home page
router.get('/addfoods', function (req, res) {
  var result= JSON.parse(localstorage.getItem('admin'))
  if(result){
  res.render('foodinterface', { msg: '' });
  }
  else {
    res.render('login',{msg:''});
  }
})

router.get('/fillallcategory', function (req, res) {

  pool.query('select * from category', function (error, result) {

    if (error) {
      res.status(500).json([])
    }
    else {
      res.status(200).json(result)
    }
  });
});


router.get('/fillallfood', function (req, res) {

  pool.query('select * from food where categoryid=?', [req.query.categoryid], function (error, result) {

    if (error) {
      res.status(500).json([])
    }
    else {
      res.status(200).json(result)
    }
  });
});

router.post('/addmorerecords', upload.single('picture'), function (req, res) {

  console.log("BODY", req.body)
  console.log("FILE", req.file)

  pool.query("insert into foodlist(foodlistid,categoryid,foodid,foodtype,ingredients,price,offerprice,picture,stock) values(?,?,?,?,?,?,?,?,?)", [req.body.foodlistid, req.body.category, req.body.food, req.body.foodtype, req.body.ingredients, req.body.price, req.body.offerprice, req.file.originalname, req.body.stock], function (error, result) {

    if (error) {
      console.log("error", error)
      res.render('foodinterface', { msg: "Record Not Submitted" })
    }
    else {
      res.render('foodinterface', { msg: "Record Submitted Sucessfully" })
    }
  });

});

router.get('/display_all_foods', function (req, res) {

  var result= JSON.parse(localstorage.getItem('admin'))
  if(!result){  
    res.render('login',{msg:''});
  }
  else{

  pool.query('select A.*,(select F.foodname from food F where F.foodid = A.foodid) as fn, (select C.categoryname from category C where C.categoryid = A.categoryid) as cn from foodlist A', function (error, result) {

    if (error) {

      res.render('displayallfoods', { data: [] });
    }
    else {

      res.render('displayallfoods', { data: result });

    }
  });

}

});

router.get('/display_by_id', function (req, res) {
  
  
  pool.query('select A.*,(select F.foodname from food F where F.foodid = A.foodid) as fn, (select C.categoryname from category C where C.categoryid = A.categoryid) as cn from foodlist A where A.foodlistid=?', [req.query.foodlistid], function (error, result) {

    if(error)
        {
          res.render("displaybyfoodid",{status:false,result:[]})
        }
       else
       {
        res.render("displaybyfoodid",{status:true,data:result[0]})
       }
  });
  
});


router.post('/editrecord', function (req, res) {
  console.log("BODY", req.body)

  if (req.body.action == 'Save') {

    pool.query("update foodlist set categoryid=?,foodid=?,foodtype=?,ingredients=?,price=?,offerprice=?,stock=? where foodlistid=?", [req.body.categoryid, req.body.foodid, req.body.foodtype, req.body.ingredients, req.body.price, req.body.offerprice, req.body.stock, req.body.foodlistid], function (error, result) {

      if (error) {
        console.log("error", error)
        res.redirect("/foods/display_all_foods")
      } 
      else {
        res.redirect("/foods/display_all_foods")
      }

    })
  }
  else {

    pool.query("delete from foodlist  where foodlistid=?", [req.body.foodlistid], function (error, result) {

      if (error) {

        res.redirect("/foods/display_all_foods")
      }
      else {
        res.redirect("/foods/display_all_foods")
      }

    })

  }

})
router.get('/showpicture', function (req, res) {

  res.render("showpicture",{ foodlistid: req.query.foodlistid, fn: req.query.fn, picture: req.query.picture })


})

router.post('/editpicture',upload.single('picture'),function (req, res) {

  pool.query("update foodlist set picture=? where foodlistid=?",[req.file.originalname,req.body.foodlistid], function (error, result) {

    if (error) {
      res.redirect("/foods/display_all_foods")
    }
    else {
      res.redirect("/foods/display_all_foods")
    }

  })


})




module.exports = router;
