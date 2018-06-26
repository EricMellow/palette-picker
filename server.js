const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';
app.locals.projects = [{id: 3, name: 'Project Name'}]
app.locals.palettes = [{id: 1, name: 'Palette Name', colors: {}, project_id: 1}]

app.get('/', (request, response) => {
  response.send('Go ahead and pick those palettes!');
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

app.post('/api/v1/projects', (request, response) => {
  const id = Date.now().toString();
  const { name } = request.body;
  const nameAlreadyExists = app.locals.projects.find(project => project.name === name)

  if (nameAlreadyExists) {
    response.status(304).send({
      error: 'Project name already exists.'
    })
  } else {
    app.locals.projects.push({id, name, palettes: {}})
    response.status(201).json({id, name, palettes: {}})
  }
})

app.get('/api/v1/projects', (request, response) => {
  response.status(200).json(app.locals.projects)
})

app.post('/api/v1/palettes', (request, response) => {
  const id = Date.now().toString();
  const { name, colors, projectName } = request.body;
  const project = app.locals.projects.find(project => project.name === projectName)
  const project_id = project.id;

  app.locals.palettes.push({id, name, colors, project_id})
  response.status(201).json({ id, name, colors, project_id })
})

app.get('/api/v1/palettes', (request, response) => {
  response.status(200).json(app.locals.palettes)
})