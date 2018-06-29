setRandomColors()
addProjectsAsOptions()
addAllPalettesToPage()

var $generateBtn = $('.generator-btn')
var $colorSwatch = $('.color-swatch')
var $projectForm = $('.create-form')
var $paletteForm = $('.save-form')

$generateBtn.on('click', setRandomColors);
$colorSwatch.on('click', toggleLock)
$projectForm.on('submit', createProject)
$paletteForm.on('submit', createPalette)
$('.projects-display').on('click', '.delete-btn', deletePalette);


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

async function deletePalette() {
  const paletteName = $(this).closest('.circle-display').find('p').text()
  const projectName = $(this).closest('.card-display').find('h4').text()
  const projectUrl = 'http://localhost:3000/api/v1/projects'

  const response = await fetch(projectUrl)
  const projects = await response.json()
  console.log(projectName)
  const matchingProject = projects.find(project => project.name === projectName)
  const paletteUrl = 'http://localhost:3000/api/v1/palettes'
  const data = {
    name: paletteName,
    project_id: matchingProject.id
  }

  fetch(paletteUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  addPaletteToPage(projectName)
}

async function createProject(event) {
  event.preventDefault()
  const url = 'http://localhost:3000/api/v1/projects'
  const projectName = $('.project-input').val()
  const data = {name: projectName}

  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  addProjectsAsOptions()
  addProjectDisplay(projectName)
  $('.project-input').val('')
}

function addProjectDisplay(projectName) {
  $('.projects-container').append(`
    <article class="card-display">
    <h4>${projectName}</h4>
    <div class="${projectName}">
    </div>
    </article>
    `)
}

async function createPalette(event) {
  event.preventDefault()
  const url = 'http://localhost:3000/api/v1/palettes'
  const paletteName = $('.palette-input').val()
  const projectName = $('.select-projects').val()
  const data = {
    name: paletteName,
    color1: $('.color1').css("background-color"),
    color2: $('.color2').css("background-color"),
    color3: $('.color3').css("background-color"),
    color4: $('.color4').css("background-color"),
    color5: $('.color5').css("background-color"),
    projectName: projectName
  }

  await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json'
    }
  })
  
  addPaletteToPage(projectName)
  $('.palette-input').val('')
}

async function addPaletteToPage(projectName) {
  const url = 'http://localhost:3000/api/v1/projects'
  const response = await fetch(url)
  const projects = await response.json()
  const matchingProject = projects.find(project => project.name === projectName)
  const paletteUrl = `/api/v1/projects/${matchingProject.id}/palettes`
  const paletteResponse = await fetch(paletteUrl)
  const palettes = await paletteResponse.json()

  if (palettes.error) {
    $(`.${projectName}`).replaceWith(`
  <div class="${projectName}">
  </div>
  `)
  } else {
    const palettesDisplay = palettes.map(palette => {
      return (`
      <div class="circle-display">
      <p>${palette.name}</p>
      <div class="color-circle" style="background-color:${palette.color1};"></div>
      <div class="color-circle" style="background-color:${palette.color2};"></div>
      <div class="color-circle" style="background-color:${palette.color3};"></div>
      <div class="color-circle" style="background-color:${palette.color4};"></div>
      <div class="color-circle" style="background-color:${palette.color5};"></div>
      <button class="delete-btn"></button>
      </div>
      `)
    })
    
    $(`.${projectName}`).replaceWith(`
    <div class="${projectName}">
    ${palettesDisplay}
    </div>
    `)
    $('.select-projects').val("")
  }
}

async function addAllPalettesToPage() {
  const url = 'http://localhost:3000/api/v1/projects'
  const response = await fetch(url)
  const projects = await response.json()

  projects.forEach(async project => {
    const url = `/api/v1/projects/${project.id}/palettes`
    const response = await fetch(url)
    const palettes = await response.json()
    
    if (palettes.error) {
      $('.projects-container').append(`
      <article class="card-display">
      <h4>${project.name}</h4>
      <div class="${project.name}">
      </div>
      </article>
      `)
    } else {
      const palettesDisplay = palettes.map(palette => {
        return (`
        <div class="circle-display">
        <p>${palette.name}</p>
        <div class="color-circle" style="background-color:${palette.color1};"></div>
        <div class="color-circle" style="background-color:${palette.color2};"></div>
        <div class="color-circle" style="background-color:${palette.color3};"></div>
        <div class="color-circle" style="background-color:${palette.color4};"></div>
        <div class="color-circle" style="background-color:${palette.color5};"></div>
        <button class="delete-btn"></button>
        </div>
        `)
      })
  
      $('.projects-container').append(`
      <article class="card-display">
      <h4>${project.name}</h4>
      <div class="${project.name}">
      ${palettesDisplay}
      </div>
      </article>
      `)
    }
  })
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

