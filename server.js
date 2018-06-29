// importing express
const express = require('express');
// instantiating express
const app = express();
// importing bodyParser
const bodyParser = require('body-parser');
// setting the environment to either whatever the env.NODE_ENV is set to or to 'development'
const environment = process.env.NODE_ENV || 'development';
// importing knex
const configuration = require('./knexfile')[environment];
// instantiating database with knex and the environment configuration
const database = require('knex')(configuration);

// setting 'public' as the default directory 
app.use(express.static('public'));
// telling app to always user bodyParser
app.use(bodyParser.json());

// setting the port to either env.PORT or 3000
app.set('port', process.env.PORT || 3000);
// storing Palette Picker as a title in what is esentially local storage for a server
app.locals.title = 'Palette Picker';

// start the app listening on port 3000
app.listen(app.get('port'), () => {
  // console.log a message once the app is listening
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

// setting a POST method to the projects endpoint to add projects
app.post('/api/v1/projects', async (request, response) => {
  // destructuring name from the request.body
  let { name } = request.body;
  // selecting all of the projects from the database
  const projects = await database('projects').select()
  // iterating over the projects to find one with the same name as the one currently attempting to be posted and saving the value to a variable
  const nameAlreadyExists = projects.find(project => {
    // return any project with a matching name
    return project.name.toUpperCase() === name.toUpperCase()
  })

  // IF there is a project with that name
  if (nameAlreadyExists) {
    // THEN return a response and an error
    return response.status(304).json({
      error: 'Project name already exists.'
    })
    // ELSE
  } else {
    // insert the project into the database and grab the new project's id
    return database('projects').insert({name}, 'id')
    // then is necessary for asynchronous code
    .then(projectId => {
      // send a response with a good code in the json format with an object containing a key of projectID with the value of that project's id
      response.status(201).json(({projectId: projectId[0]}))
    })
    // if there is an error
    .catch(error => {
      // send a response with an internal server error code in json format that contains the error
      response.status(500).json({error})
    })
  }
})

// setting a GET method for the projects endpoint
app.get('/api/v1/projects', (request, response) => {
  // selecting all projects from the database
  database('projects').select()
  // then is necessary for asynchronous code
    .then(projects => {
      // sending a response with a good code in json format containing all of the projects
      response.status(200).json(projects)
    })
    // if there is an error
    .catch(error => {
      // send a response with an internal server error code in json format that contains the error
      response.status(500).json({error})
    })
})

// setting a POST method for the palettes endpoint
app.post('/api/v1/palettes', async (request, response) => {
  // destructuring name, projectName, and all the colors from the request.body
  const { 
    name, 
    color1, 
    color2, 
    color3, 
    color4, 
    color5,  
    projectName } = request.body;
    // getting all of the projects and setting them to a variable
  const projects = await database('projects').select()
  // iterating over the projects and setting the matching project to a variable
  const matchingProject = projects.find(project => {
    // returning the project with a name that matches the projectName
    return project.name === projectName
  })
  // grabbing the id from the matching project and storing it as a variable
  const project_id = matchingProject.id;

  // inserting the palette into the database with the name, project_id, and all of the color key:value pairs being destructured and returning the id of that new palette
  database('palettes').insert({
    name,
    color1,
    color2,
    color3,
    color4,
    color5,
    project_id
  }, 'id')
  // then is necessary for asynchronous code
    .then(paletteId => {
      // returning a response with a good status in json format with a key of paletteId and the value of the id of the newly created palette
      response.status(201).json({paletteId: paletteId[0]})
    })
    // if there is an error
    .catch(error => {
      // send a response with an internal server error code in json format that contains the error
      response.status(500).json({error})
    })
})

// setting a DELETE method for the palettes endpoint
app.delete('/api/v1/palettes', async(request, response) => {
  // searching through the palettes database for the record where its name matches the name sent in the request.bod and its project_id also matches the id sent in the request.body
  database('palettes').where({
    name: request.body.name,
    project_id: request.body.project_id
  })
  // deleting that record from the database
  .del()
    .catch(error => {
      // send a response with an internal server error code in json format that contains the error
      response.status(500).json({ error })
    })
})

// setting a GET method for the palettes endpoint
app.get('/api/v1/palettes', (request, response) => {
  // selecting all of the rows from the palettes database
  database('palettes').select()
  // then is necessary for asynchronous code
    .then(palettes => {
      // returning a response with a good status code in json format with all of the palettes
      response.status(200).json(palettes)
    })
    // if there is an error
    .catch(error => {
      // send a response with an internal server error code in json format that contains the error
      response.status(500).json({ error })
    })
})

// setting a GET method to retrieve all of the palettes for a specific project
app.get('/api/v1/projects/:id/palettes', (request, response) => {
  // selecting all the palettes where the palette has a project_id that matches the id passed into the endpoint
  database('palettes').where('project_id', request.params.id).select()
  // then is necessary for asynchronous code
    .then(palettes => {
      // IF there are palettes that contain a matching project_id
      if (palettes.length) {
        // THEN send a response with a good status code in json format with an array of all of the palettes
        response.status(200).json(palettes);
        // ELSE
      } else {
        // send a response with an error status code in json format with an object containing a key of error and a value of an error message
        response.status(404).json({
          error: `Could not find palettes with id ${request.params.id}`
        });
      }
    })
    // if there is an error
    .catch(error => {
      // send a response with an internal server error code in json format that contains the error
      response.status(500).json({ error });
    });
});

// export the app for testing purposes
module.exports = app;