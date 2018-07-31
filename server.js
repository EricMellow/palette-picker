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
    return response.status(304).json({
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
  const matchingProject = projects.find(project => {
    return project.name === projectName
  })
  
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

app.delete('/api/v1/palettes', async(request, response) => {
  // const palette = await database('palettes').where({
  //   name: request.body.name,
  //   project_id: request.body.project_id
  // })
  // const paletteId = palette.id

  database('palettes').where({
    name: request.body.name,
    project_id: request.body.project_id
  })
  .del()
  .then()
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

app.get('/api/v1/projects/:id/palettes', (request, response) => {
  database('palettes').where('project_id', request.params.id).select()
    .then(palettes => {
      if (palettes.length) {
        response.status(200).json(palettes);
      } else {
        response.status(404).json({
          error: `Could not find palettes with id ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});


module.exports = app;