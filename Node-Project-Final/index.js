//all the modules need to be installed from npm
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//connecting to mongodb
mongoose.connect('mongodb://localhost/myDB');
let db = mongoose.connection;

//checking if mongodb is connected
db.once('open',()=>{
    console.log("db connected :)");
});



//calling express
const app = express();

//setting view and view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

//bringing the schema 
let User = require('./models/user_model');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//for static content
app.use(express.static(path.join(__dirname,'public')));


//setting route for default url get(home route)
app.get('/',(req,res)=>{
    res.render('home',{title:'logIn' });
});

app.post('/',async(req,res)=>{
    let user = await User.findOne({ username: req.body.username ,password:req.body.password});
    if (user) {
       res.redirect('/welcome');  
    }
    else
    {
       // alert("wrong username or password");
       res.status(400).send('Wrong username or password');
      // res.redirect('/');  
    } 
});
 
app.get('/welcome',(req,res)=>{ 
   
    User.find({},function(err,user){ 
      if(err)
       throw err;
        res.render("welcome",{
            title:'Welcome!!',usertables : user
          });
     
    }); 
    
});


app.get('/signIn',(req,res)=>{
    res.render('signIn',{title:'signIn'});
});



app.post('/signIn',(req,res)=>{
    let user=new User();
    user.username = req.body.username;
    user.password=req.body.password;
    user.save(function(err){
        if(err)
        {console.log(err); 
        return;
        }
        else
        {
        //res.send("added succesfully!!!")
        res.redirect('/welcome');  
        }   
    })

});

//setting port to listen
const PORT = process.env.Port||5000;
app.listen(PORT,()=>console.log('server started on '+PORT+' :)'));