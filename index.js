const express = require('express');
const jsonfile = require('jsonfile');
const { make } = require('simple-body-validator');
const cors = require('cors'); //  be able to make requests through the frontend

const server = express(); // web server going up

server.use(express.json());

const FILE = 'courses.json';

server.use((req, res, next) => {  // the permissions of the methods that will be accessed by http
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    server.use(cors());
    next();
});

server.get('/courses', (req, res) => { // request that returns all courses. (when open the screen call this method)
    jsonfile.readFile(FILE, (err, obj) => { // file reading method
        if( err ){       // if there is an error, it returns to the client
            console.log("error with json read file:",err);
            res.status(503).send("error reading filee");
            return; 
        }

        res.send(obj.courses); // will send the list of courses to the client (machine that accesses)
    });
});

// request that returns a single course by Index
server.get('/courses/:index', (req, res) => {
    jsonfile.readFile(FILE, (err, obj) => {
        if( err ){      // if there is an error, it returns to the client
            console.log("error with json read file:",err);
            res.status(503).send("error reading file");
            return; 
        }

        let inputId = parseInt( req.params.index );
    
        var course; // is the course that will be returned
    
        for( let i=0; i<obj.courses.length; i++ ){ //loop para achar o curso do index
    
            let currentCourse = obj.courses[i];

            if( currentCourse.id === inputId ){ // validates if the course is the same as the index
                course = currentCourse;
            }
        }
        
        if (course === undefined) { // if the course is not found, it returns "not found". if found, returns the course data
    
            // send 404 back
            res.status(404);
            res.send("not found");
        } else {    
            res.send(course);
        }
    });
});

server.post('/courses', (req, res) => { // request that adds a new course 
    const rules = { // the course acceptance rules. (you have to fill all fields)
        name: 'required|string',
        description: 'required|string'
    };

    const validator = make().setData(req.body).setRules(rules); // who actually runs the rule test

    if (! validator.validate()) { // if it does not pass the rule returns the error
        console.log('Errors: ', validator.errors().all());
        res.status(400).send(validator.errors().all());
        return;
    }

    jsonfile.readFile(FILE, (err, obj) => { // file reading method
        if( err ){      // if there is an error
            console.log("error with json read file:",err);
            res.status(503).send("error reading file");
            return; 
        }

        const { name, description } = req.body;

        const lastCourse = obj.courses.slice(-1); // get the last ID

        const id = lastCourse[0].id + 1; // add 1 to the last ID which will be the ID of the new course

        obj.courses.push({id, name, description}); // add a new course to the course list

        jsonfile.writeFile(FILE, obj); // save the course file

        res.status(200).send(obj.courses); // returns the success to the client

    });
});

server.delete('/courses/:index', (req, res) => { // request to delete a course
    jsonfile.readFile(FILE, (err, obj) => {
        if( err ){      // if there is an error, it returns to the client
            console.log("error with json read file:",err);
            res.status(503).send("error reading file");
            return; 
        }

        let inputId = parseInt( req.params.index );

        for( let i=0; i<obj.courses.length; i++ ){ // loop to find the course to be deleted
    
            let currentCourse = obj.courses[i];

            if( currentCourse.id === inputId ){ // if the ID of the course is the same as the ID sent, then delete it from the list of courses
                obj.courses.splice(i, 1); 
            }
        }

        jsonfile.writeFile(FILE, obj); // save to file without course deleted

        res.status(200).send('deleted successfully');

    });
});

server.put('/courses/:index', (req, res) => { // it is the method that changes the course
    const rules = {
        name: 'required|string',
        description: 'required|string'
    };

    const validator = make().setData(req.body).setRules(rules);

    if (! validator.validate()) {  // if error
        console.log('Errors: ', validator.errors().all());
        res.status(400).send(validator.errors().all());
        return;
    }

    jsonfile.readFile(FILE, (err, obj) => {  // file reading method
        if( err ){      
            console.log("error with json read file:",err);
            res.status(503).send("error reading file");
            return; 
        }

        let inputId = parseInt( req.params.index );
    
        var courseId;
    
        for( let i=0; i<obj.courses.length; i++ ){
    
            let currentCourse = obj.courses[i];

            if( currentCourse.id === inputId ){
                courseId = i;
            }
        }
        
        if (courseId === undefined) {
    
            // send 404 back
            res.status(404);
            res.send("not found");
        } else {

            const { name, description } = req.body; // new course data
            const course = { id: inputId, name, description }

            obj.courses[courseId] = course;
            jsonfile.writeFile(FILE, obj); // save changed course
            res.status(200).send(course);
        }
    });
});

server.listen(3000); // server port