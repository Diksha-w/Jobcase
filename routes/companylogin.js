var express = require('express');
var router = express.Router();
var Company = require('../models/company');


//-----------------------LOGIN ----------------------------------//
router.get('/', function (req, res, next) {
   
	return res.render('logincompany.ejs');
});

router.post('/ ', function (req, res, next) {
	//console.log(req.body);
	Company.findOne({email:req.body.email},function(err,data){
		if(data){
			
			if(data.password==req.body.password){
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
                res.redirect('/dashboard');
				
			}else{
				res.send({"Error":"Wrong email or password!"});
			}
		}else{
			res.send({"Error":"Wrong email or password!"});
		}
	});
});


//--------------------LOGOUT---------------------------------------
router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/company/');
    	}
    });
}
});

//----------------------REGISTER-----------------------------------
router.get('/register', function (req, res, next) {
	return res.render('registercompany.ejs');
});

router.post('/register', function(req, res, next) {
	console.log(req.body);
	var personInfo = req.body;


	if(!personInfo.email || !personInfo.name || !personInfo.password || !personInfo.cpassword){
		res.send();
	} else {
		if (personInfo.password == personInfo.cpassword) {

			Company.findOne({email:personInfo.email},function(err,data){
				if(!data){
					var c;
					Company.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newCompany = new Company({
							unique_id:c,
							email:personInfo.email,
							name: personInfo.name,
							password: personInfo.password,
							passwordConf: personInfo.cpassword,
							address:personInfo.address,
							address2:personInfo.address2,
							city:personInfo.city,
							state:personInfo.state,
							zip:personInfo.zip
						});

						newCompany.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
				
                    res.redirect('/dashboard')
				}else{
					res.send({"Error":"Email is already used."});
				}

			});
		}else{
			res.send({"Error":"password is not matched"});
		}
	}
});


module.exports = router;
