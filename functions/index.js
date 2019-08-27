const functions = require('firebase-functions');
const admin = require('firebase-admin');

const cors = require('cors')({origin: true});




// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

//storage
admin.initializeApp({
    //credential: admin.credential.cert(serviceAccount),
  
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://bitsdelivery-6a7e4.firebaseio.com/",
    storageBucket: "gs://bitsdelivery-6a7e4.appspot.com"
  });



  /*var opened = window.open("");
  var element = `
  <html>
  <head><title>Info</title></head>
  <body>
  <p id="Index">Index : loading</p>   
  <p id="Email">Email : loading</p>  
  <p id="Name">Name : loading</p>  
  <p id="Hostel">Hostel : loading</p>  
  <p id="Id">Id : loading</p>       
  </body>
  </html>`
  
  opened.document.write(element);  */

exports.getStudentDetails = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        
        const dest = req.query.dest;
        const flag = req.query.flag;
       // const dest = 'f20170712@goa.bits-pilani.ac.in'

       var key = "";
       var id = "";
       var name ="";
       var hostel = "";
       var room ="";

        const databaseRef = admin.database().ref(`StudentList`);

        var query = databaseRef.orderByChild("Email").equalTo(dest);

        return new Promise(function(resolve, reject) 
        {
            console.log("Entered the promise");
    
            query.on("child_added", function(snapshot) {
            if(snapshot.exists())
            {
                key = snapshot.key;
                id = snapshot.child('Id').val();
                name =snapshot.child('Name').val();
                hostel = snapshot.child('Hostel').val();
                room = snapshot.child('Room').val();

                console.log(key+" "+id+" "+name+" "+snapshot.numChildren() + " "+ snapshot.exists());

                if(flag=="true")
                {
                    var _email = dest.replace(/\./g,'_');
                    console.log(_email);
                    const refToStudent = admin.database().ref(`Users/${_email}`);
                    refToStudent.update({
                        Id: id
                    });
                    
                }

                res.send(`
                <html>
                <head><title>Info</title></head>
                <body>
                <p>Index : ${key}</p>   
                <p>Email : ${dest}</p>  
                <p>Name : ${name}</p>  
                <p>Room : ${hostel} ${room}</p>  
                <p>Id : ${id}</p>       
                </body>
                </html>`);
            }

            else
            {
                res.send(`
                <html>
                <head><title>Fail</title></head>
                <body>
                <p>FAIL</p>         
                </body>
                </html>`);
            }

        });
    });
    });
});
