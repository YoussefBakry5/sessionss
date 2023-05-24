const express = require('express');
const session = require('express-session')
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const Employees = require('./models/employees');  

// express app
const app = express();
const dbURI='mongodb+srv://yousef2104707:bakry123@cluster0.evifowo.mongodb.net/beko?retryWrites=true&w=majority';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(8080))
  .catch(err => console.log(err));

  app.use(express.urlencoded({ extended: true }));

// default options
app.use(fileUpload());

app.use(session({ secret: 'Your_Secret_Key' }))
// register view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', { user: (req.session.user === undefined ? "" : req.session.user) });
});
app.get('/login', (req, res) => {
  res.render('login', { user: (req.session.user === undefined ? "" : req.session.user) });
});
app.get('/viewAll', (req, res) => {
Employees.find()
.then(result=>{
    res.render('viewAll', { employees: result ,user: (req.session.user === undefined ? "" : req.session.user) });
})
.catch(err=>{
console.log(err);
})

});
app.post('/profile', (req, res) => {
var query = { UserName: req.body.un, Password: req.body.pw };  

  Employees.find(query)
  .then(result => {
    console.log(result[0])
    console.log(result[0].UserName)

    req.session.user=result[0];
    res.render('profile', { userP: result[0], user: (req.session.user === undefined ? "" : req.session.user) });

  })
  .catch(err => {
    console.log(err);
  });
});
app.get('/Myprofile', (req, res) => {
  res.render('profile', {userP:req.session.user, user: (req.session.user === undefined ? "" : req.session.user) });
});


  
  app.get('/emp/:id', (req, res) => {
var query={"_id":req.params.id};
    Employees.find(query)
      .then(result => {
        res.render('emp',{emp: result[0], user:(req.session.user === undefined?"":req.session.user)});
      })
      .catch(err => {
        console.log(err);
      });
  });
  app.get('/slide', (req, res) => {
    res.render('slide', { user: (req.session.user === undefined ? "" : req.session.user) });
});
app.get('/about', (req, res) => {
  res.render('about', { user: (req.session.user === undefined ? "" : req.session.user) });
});
  app.get('/signup', (req, res) => {
    res.render('signup', { user: (req.session.user === undefined ? "" : req.session.user) });
});
app.post('/signup-action', (req, res) => {
    let imgFile;
    let uploadPath;
console.log(req.files)
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  imgFile = req.files.img;
  uploadPath = __dirname + '/public/images/' + req.body.un+'.png';

  // Use the mv() method to place the file somewhere on your server
  imgFile.mv(uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

      const emp = new Employees({
        UserName: req.body.un,
        Password: req.body.pw,
        Image: req.body.un+'.png',
        Type: req.body.type
      })
    
   	   emp.save()
        .then(result => {
        res.redirect('/');  
       })
       .catch(err => {
        console.log(err);
      });
    });   
        
});


app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});