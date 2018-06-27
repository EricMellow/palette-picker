setRandomColors()

var $generateBtn = $('.generator-btn')
var $colorSwatch = $('.color-swatch')
var $projectForm = $('.create-form')
var $paletteForm = $('.save-form')

$generateBtn.on('click', setRandomColors);
$colorSwatch.on('click', toggleLock)
$projectForm.on('submit', createProject)
$paletteForm.on('submit', createPalette)


function randomColorGenerator() {
  const value1 = Math.floor(Math.random() * 255)
  const value2 = Math.floor(Math.random() * 255)
  const value3 = Math.floor(Math.random() * 255)

  return `rgba(${value1}, ${value2}, ${value3})`
}

function setRandomColors() {
  const colorDivs = ['.color1', '.color2', '.color3', '.color4', '.color5']

  colorDivs.forEach(div => {
    if (!$(div).hasClass("locked")) {
      $(div).css("background-color", randomColorGenerator)
    }
  })
}

function toggleLock() {
  $(this).toggleClass("locked")
  if ($(this).hasClass("locked")) {
    $(this).text("Locked")
  } else {
    $(this).text("Lock")
  }
}

function createProject(event) {
  event.preventDefault()
  const url = 'http://localhost:3000/api/v1/projects'
  const projectName = $('.project-input').val()
  const data = {name: projectName}

  fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json'
    }
  })

  addProjectsAsOptions()
  $('.project-input').val('')
}

function createPalette(event) {
  event.preventDefault()
  const url = 'http://localhost:3000/api/v1/palettes'
  const paletteName = $('.palette-input').val()
  const data = {
    name: paletteName,
    colors: {
      color1: $('.color1').css("background-color"),
      color2: $('.color2').css("background-color"),
      color3: $('.color3').css("background-color"),
      color4: $('.color4').css("background-color"),
      color5: $('.color5').css("background-color"),
    },
    projectName: $('.select-projects').val()
  }
  
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json'
    }
  })
  $('.palette-input').val('')
}

async function addProjectsAsOptions() {
  const url = 'http://localhost:3000/api/v1/projects'
  const response = await fetch(url)
  const projects = await response.json()
  const options = projects.map(project => {
    return (`<option value=${project.name}>${project.name}</option>`)
  })

  $('.select-projects').replaceWith(`<select 
  name="projects" 
  class="select-projects">
  ${options}
  </select >`)
}

