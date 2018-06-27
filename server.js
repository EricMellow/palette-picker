const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(express.static('public'));
app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';
app.locals.projects = [{id: 3, name: 'Project Name'}]
app.locals.palettes = [{id: 1, name: 'Palette Name', colors: {}, project_id: 1}]

app.get('/', (request, response) => {
  // response.send('Go ahead and pick those palettes!');
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

app.post('/api/v1/projects', async (request, response) => {
  let { name } = request.body;
  const projects = await database('projects').select()
  const nameAlreadyExists = projects.find(project => {
    return project.name.toUpperCase() === name.toUpperCase()
  })

  if (nameAlreadyExists) {
    return response.status(304).send({
      error: 'Project name already exists.'
    })
  } else {
    return database('projects').insert({name}, 'id')
    .then(projectId => {
      response.status(201).json(({projectId: projectId[0]}))
    })
    .catch(error => {
      response.status(500).json({error})
    })
  }
})

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then(projects => {
      response.status(200).json(projects)
    })
    .catch(error => {
      response.status(500).json({error})
    })
})

app.post('/api/v1/palettes', async (request, response) => {
  const { 
    name, 
    color1, 
    color2, 
    color3, 
    color4, 
    color5,  
    projectName } = request.body;
  const projects = await database('projects').select()
  const matchingProject = projects.find(project => project.name === projectName)
  const project_id = matchingProject.id;

  database('palettes').insert({
    name,
    color1,
    color2,
    color3,
    color4,
    color5,
    project_id
  }, 'id')
    .then(paletteId => {
      response.status(201).json({paletteId: paletteId[0]})
    })
    .catch(error => {
      response.status(500).json({error})
    })
})

app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then(palettes => {
      response.status(200).json(palettes)
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})