const express = require('express');
const jsonfile = require('jsonfile');
const { make } = require('simple-body-validator');

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
            res.status(503).send("error reading file");
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

server.post('/courses', (req, res) => {

    const rules = {
        name: 'required|string',
        description: 'required|string'
    };

    const validator = make().setData(req.body).setRules(rules);

    if (! validator.validate()) {
        console.log('Errors: ', validator.errors().all());
        res.status(400).send(validator.errors().all());
        return;
    }

    jsonfile.readFile(FILE, (err, obj) => {
        if( err ){      
            console.log("error with json read file:",err);
            res.status(503).send("error reading file");
            return; 
        }

        const { name, description } = req.body;

        const lastCourse = obj.courses.slice(-1);

        const id = lastCourse[0].id + 1;

        obj.courses.push({id, name, description});

        jsonfile.writeFile(FILE, obj);

        res.status(200).send(obj.courses);

    });
});

server.delete('/courses/:index', (req, res) => {
    jsonfile.readFile(FILE, (err, obj) => {
        if( err ){      
            console.log("error with json read file:",err);
            res.status(503).send("error reading file");
            return; 
        }

        let inputId = parseInt( req.params.index );

        for( let i=0; i<obj.courses.length; i++ ){
    
            let currentCourse = obj.courses[i];

            if( currentCourse.id === inputId ){
                obj.courses.splice(i, 1); 
            }
        }

        jsonfile.writeFile(FILE, obj);

        res.status(200).send('deleted successfully');

    });
});

server.put('/courses/:index', (req, res) => {

    const rules = {
        name: 'required|string',
        description: 'required|string'
    };

    const validator = make().setData(req.body).setRules(rules);

    if (! validator.validate()) {
        console.log('Errors: ', validator.errors().all());
        res.status(400).send(validator.errors().all());
        return;
    }

    jsonfile.readFile(FILE, (err, obj) => {
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

            const { name, description } = req.body;
            const course = { id: inputId, name, description }

            obj.courses[courseId] = course;
            jsonfile.writeFile(FILE, obj);
            res.status(200).send(course);
        }
    });
});

server.listen(3000);
