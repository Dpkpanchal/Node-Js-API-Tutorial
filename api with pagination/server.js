var express = require('express');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./model.js');
var Employee = require('./employee.js');
const mongoosePaginate=require('mongoose-paginate');
var app = express();

//const bcrypt = require("bcrypt");

mongoose.connect('mongodb://localhost/apidatabase');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extented:true}));

var port = process.env.PORT || 8888;

//api for signup
app.post('/signup', (req, res)=>{
	User.findOne({email:req.body.email}, (err, user)=>{
		console.log(user)
		//console.log("Requested data are"+JSON.stringify(req.body))
		if(err){
			return res.status(500).json({
				message:"Error Occured"
			})
		}
		else if(user){
			console.log("\nEmail id Registered with\n\n"+user)
			return res.status(409).json({
				message:"Email id already Registered"
			})
		}
		else{
				var user = new User(req.body)
				user.save((err, result)=>{ // insert a document because user is a single object
				//User.create((req.body),(err, result)=>{ // insert many data at a time because User is a array of objects
				if(err){
					return res.status(500).json({
						message:"Error Occured"
					})
				}
				else{
						console.log("\nuser Created with\n\n"+result)
						return res.status(201).json({
						message:"Signup successfull"
					})
				}
			})
		}
	})
})


// api for addEmployee
app.post('/addEmployee', (req, res)=>{
	User.findOne({email:req.body.email}, (err, user)=>{ // findOne return only single objects
		if(err){
			return res.status(500).json({
				error: err
			})
		}
		else if(!user){
			return res.status(401).json({
				message:"Admin Email is not registered"
			})
		}
		else{
			
			Employee.findOne({empemail:req.body.empemail}, (err, employee)=>{
				if(err){
					return res.status(500).json({
						error: err
					})
				}
				else if(employee){
					console.log("\nEmployee Email id already Registered with\n\n"+employee)
					return res.status(409).json({
						message:"Employee Email id already Registered"
					})
				}
				else{
					
					var data = {
						empname:req.body.empname,
						empemail:req.body.empemail,
						empcontact:req.body.empcontact,
						empage:req.body.empage,
						email:req.body.email
					}
					var employee = new Employee(data)
					employee.save((err, result)=>{
						if(err){
							return res.status(500).json({
								error: err
							})		
						}
						else {
							console.log("\nEmployee added successfully\n\n"+result)
							return res.status(201).json({
								message:"Employee added successfully"
							})
						}
					})
				}
			})
		}
	})
});






// api for login 
app.post('/login', (req, res)=>{
	User.findOne({email:req.body.email}, (err, user)=>{ // find one return only single object
		if(err)
		{
			//res.json({responseCode:400,responseMessage:"Error Occured"});
			return res.status(500).json({
				error: err
			})
		}
		else if(!user){
			
			return res.status(409).json({
				message:"Email id not registered"
			})
			 
		}
		else{
			//res.json({responseCode:400,responseMessage:"email id or password incorrect"});
			
			if(user.password == req.body.password){
				return res.status(200).json({
					message:"you have successfully login"
				})
			}
			else{
				return res.status(409).json({
					message:"password not match"
				})
			}
			
		}
	})
})



//api for show employee
app.post('/show', (req, res)=>{
	Employee.find({email:req.body.email}, (err, employee)=>{
		if(err){
			return res.status(500).json({
				error:err
			})
		}
		else if(employee.length < 1){
			return res.status(409).json({
				message:"Admin email does not exit"
			})
		}
		else{
			return res.send(employee)
		}
	})
})



// search filter on name in nodejs

app.post('/search', (req, res)=>{
	var pattern = new RegExp('^'+req.body.empname, 'i')
	Employee.find({empname:pattern}, (err, result)=>{
		if(err){
			return res.status(500).json({
				error:err
			})
		}
		else if(result.length < 1){
			return res.status(409).json({
				message:"Name does't exit in Employee list"
			})
		}
		else{
			return res.send(result)
		}
	})
})



// pagination api in nodejs
app.post('/pagination', (req, res)=>{
	let options = {
		select:" -email",
		page:req.body.page || 1,
		limit:req.body.limit || 10
	}

	console.log(req.body);
	Employee.paginate({email:req.body.email}, options , (err, result)=>{
		if(err){
			return res.status(500).json({
				error:err
			})
		}
		else{
			return res.send(result);
		}
	})
})


// Update Schema in nodejs

// app.post('/update',function(req,res){
// 	User.findByIdAndUpdate({_id:req.body._id},{
// 		$set:{
				// name:req.body.name,
				// age:req.body.age,
				// email:req.body.email,
				// contact:req.body.contact,
				// password:req.body.password			
// 		}
// 	},{new:true}).exec(function(err, result){
// 		return res.send(result)
// 	})
// })





// api for update data

app.post('/:userId',function(req,res){
	User.findByIdAndUpdate({_id:req.params.userId},{   // findByIdAndUpdate or update
		$set:{
				"name":req.body.name,
				"age":req.body.age,
				"email":req.body.email,
				"contact":req.body.contact,
				"password":req.body.password
			}
	
		},{new:true}, (err, result)=>{
			if(err){
				return res.status(409).json({
					error:err
				})

			}else {
					console.log("user Updated===>\n\n"+result)
					return res.status(200).json({
					message: "User updated"
				})
			}
		})
})



// api for delete data
app.delete("/:userId", (req, res, next)=>{
	User.findByIdAndRemove({_id:req.params.userId}).exec()  // findByIdAndRemove or remove
	.then(result =>{
		console.log(result);
		return res.status(200).json({
			message: "User deleted"
		})
	}).catch(err =>{
		return res.status(500).json({
			error: err
		})
	});
})






// it's for when the any key is not unique and you want to registerd same email id and hash is for convert the password into hash key

// app.post('/signup', (req, res, next)=> {

// 	User.find({email:req.body.email}).exec().then(user=>{
// 		if(user.length >= 1){
// 			return res.status(409).json({
// 				message:"Email id already registerd"
// 			})
// 		}
// 		else{
			
// 			bcrypt.hash(req.body.password, 10, (err, hash)=>{
// 			if(err){
// 				return res.status(500).json({
// 					error: err
// 				});

// 			}else{

// 			const user = new User({


// 									name: req.body.name,

// 									age: req.body.age,

// 									contact: req.body.contact,
								
// 									email: req.body.email,
								
// 									password: hash
// 								});

// 				user
// 				.save()
// 				.then(result => {
// 					console.log(result);
// 					return res.status(201).json({
// 						message: 'User Created'
// 					});
// 				})
// 				.catch(err => {
// 					console.log(err);
// 					return res.status(500).json({
// 						error: err
// 					});
// 				});

// 			}
	
// 	});
// 		}
// 	})

	

// });





// app.post("/login", (req, res, next)=>{

// 	User.find({email:req.body.email}).exec().then(user=>{
// 		if(!user){
// 			return res.status(401).json({
// 				message:"Email id not registerd"
// 			})
// 		}
// 		bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
// 			if(err){
// 				return res.status(401).json({
// 					message:"Authentications failed"
// 				})
// 			}
// 			if(result){
// 				return res.status(201).json({
// 					message:"you have successfully login"
// 				})
// 			}
// 			return res.status(409).json({
// 				message:"Password not match"
// 			})
// 		})
// 	})
	
// })



//  delete the specific user from id like : http://localhost:8888/userd












// app.post("/login", (req, res)=>{

// 	User.findOne({email:req.body.email, password:req.body.password}, (err, result)=>{
// 		if(!result){
// 			return res.status(201).json({
// 						message: 'Please Sign Up'
// 					});
// 		}
// 		else{
// 			return res.status(201).json({
// 						message: 'you have succesfully'
// 			});	
// 		}
// 	})
	
// })



app.listen(port, function(){
	console.log("port runing on http://localhost:"+port);
})
