const express = require("express");
const bodyParser = require("body-parser");
const multer = require('multer');
const folderPath ='./Files';

app = express();
app.use(bodyParser.json());


var storage = multer.diskStorage({
   destination:function (req,file,callback) {
       callback(null,'./uploads');
   },
    filename:function (req,file,callback) {
       callback(null,file.originalname)
    }
});

// var upload = multer({storage:storage}).single('myfile');
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
}).single('image');

//Post API with URL query
app.post("/",(req,res)=>{
    let firstName = req.query.firstName;
    let lastName = req.query.lastName;

    res.send(firstName+" "+lastName);
});


//Post API with header
app.post("/auth",(req,res)=>{
   let user = req.header("userName");
   let pass = req.header("password");

   res.send("username: "+user+"password: "+pass);
});

//Post API with body
app.post("/data",(req,res)=>{
   let jsonData = req.body;
   let name = jsonData['name'];
   let city = jsonData['city'];
   res.send("name: "+name+" city: "+city);
});

//File upload


app.post("/upload",(req,res)=>{
   upload(req,res,(error)=>{
       if(error)
       {
           res.send("File upload failed");
       }
       else
       {
           res.send("File upload success");
       }
   })
});

// GET request for single file
app.get('/single',function(req,res) {
    res.download(folderPath+'/single.txt', function(err) {
        if(err) {
            console.log(err);
        }
    })
});



app.listen(8000,()=>{
    console.log("Connection Success")
});