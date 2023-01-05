const express = require('express');
const jsonfile = require('jsonfile');

const server = express();

server.use(express.json());

const FILE = 'courses.json';


server.get('/courses', (req, res) => {
    jsonfile.readFile(FILE, (err, obj) => {
        if( err ){      
            console.log("error with json read file:",err);
            res.status(503).send("error reading filee");
            return; 
        }

        res.send(obj.courses);
    });
});


server.get('/courses/:index', (req, res) => {
    jsonfile.readFile(FILE, (err, obj) => {
        if( err ){      
            console.log("error with json read file:",err);
            res.status(503).send("error reading filee");
            return; 
        }

        let inputId = parseInt( req.params.index );
    
        var course;
    
        for( let i=0; i<obj.courses.length; i++ ){
    
            let currentCourse = obj.courses[i];

            if( currentCourse.id === inputId ){
                course = currentCourse;
            }
        }
        
        if (course === undefined) {
    
            // send 404 back
            res.status(404);
            res.send("not found");
        } else {    
            res.send(course);
        }
    });
});



server.listen(3000);
