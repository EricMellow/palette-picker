const express = require('express');
const app = express();

app.use(express.static('public'));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';
app.locals.projects = [{id: 1, name: 'Project Name', palettes: {}}]

app.get('/', (request, response) => {
  response.send('Go ahead and pick those palettes!');
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

app.post('/api/v1/projects', (response, request) => {
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