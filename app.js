var express    = require("express") ,
mongoose       = require("mongoose") , 
bodyParser     = require("body-parser") , 
app            = express() ,
methodOverride = require("method-override") ,
fs             = require("fs") ,
multer         = require("multer") ; 
var expressSanitizer = require("express-sanitizer") ; 

mongoose.connect("mongodb://localhost/restful_blog_app") ; 
app.set( "view engine" , "ejs" ) ;
app.use( express.static("public") ) ;
app.use( express.static("views/images") ) ;
app.use(bodyParser.urlencoded({extended : true } ) ) ;
app.use( expressSanitizer()) ;
app.use( methodOverride("_method")) ;

var blogSchema = mongoose.Schema ({
       title : String , 
       image : String ,
       body : String ,
       created : { type : Date , default : Date.now() } 
});

var ItemSchema = mongoose.Schema ({
       img : {
              data : Buffer , 
              contentType : String 
       }
});

var Item = mongoose.model( "Images " , ItemSchema ) ; 
var Blog = mongoose.model( "Blog" , blogSchema ) ; 

app.get( "/blogs" , function( req , res ) {
       Blog.find ( {} , function ( err , object ) {
              if ( err ) {
                     res.redirect ( "/" ) ; 
              } else {
                     res.render ( "index" , { blogs : object } ) ; 
              }
       });
});


app.get ( "/blogs/new" , function ( req , res ) {
       res.render ( "new" ) ;
});

app.post ( "/blogs" , function ( req , res ) {
       console.log(req.body) ; 
       req.body.blog.body = req.sanitize( req.body.blog.body ) ;
       console.log(req.body) ; 
       Blog.create ( req.body.blog , function ( err , newBlog ) {
              if ( err ) {
                     console.log("error") ;
                     res.render ( "new" ) ; 
              } else {
                     console.log("new object is added ") ; 
                     res.redirect ( "/" ) ;
              }
       }) ;
}) ; 

app.get ( "/blogs/:id" , function ( req , res ) {
       Blog.findById( req.params.id , function ( err , foundBlog ) {
              if ( err ) {
                     res.redirect( "/blogs" ) ; 
              } else {
                     res.render ( "show" , { blog : foundBlog } ) ; 
              }
       });
});

app.get ( "/blogs/:id/edit" , function ( req , res ) {
       Blog.findById ( req.params.id , function ( err , foundObj ) {
              if ( err ) {
                     res.redirect ( "/blogs" ) ; 
              } else {
                     res.render ( "edit" , { blog : foundObj } ) ;
              }
       });
});

app.put ( "/blogs/:id" , function ( req , res ) {
       req.body.blog.body = req.sanitize( req.body.blog.body ) ; 
       Blog.findByIdAndUpdate( req.params.id , req.body.blog , function ( err , updatedObj ) {
              if ( err ) {
                     res.redirect ( "/blogs" ) ; 
              } else {
                     var id = req.params.id ; 
                     res.redirect ( "/blogs/" + id ) ;
              }
       });
});

app.delete ( "/blogs/:id" , function ( req , res ) {
       var id = req.params.id ;
       Blog.findByIdAndRemove ( id , function ( err ) {
              if (err) {
                     console.log("Error") ; 
                     res.redirect("/blog") ;
              } else {
                     console.log("the element is deleted !"  ) ;
                     res.redirect("/") ;
              }
       }); 
});


app.get ( "/" , function( req , res ) {
       console.log("Came here again! " ) ;
       Blog.find( {} , function ( err , object ) {
              if ( err ) {
                     console.log ( "Soemthing went wrond ! " ) ; 
              } else {
                     console.log("else part ! " ) ;
                     console.log(object) ; 
                     var something = !(JSON.stringify( object ) == "[]") ; 
                     console.log("Something : " + something ) ;
                     res.render ( "index" , { blogs : object , something } ) ; 
              }
       });
});

app.get( "*" , function ( req , res ) {
	console.log ( "This 404 function is executing !! " ) ; 
	res.render ( "404" ) ; 
}) ; 


app.listen( 3000 , function() {
       console.log("Server Started ! " ) ;
});
