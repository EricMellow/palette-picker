setRandomColors()

var $generateBtn = $('.generator-btn')
var $colorSwatch = $('.color-swatch')
var $projectForm = $('.create-form')

$generateBtn.on('click', setRandomColors);
$colorSwatch.on('click', toggleLock)
$projectForm.on('submit', createProject)


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
  // check and see if a folder with that name already exists

  // if no folder exists go to /projects and create one

  $('.project-input').val('')
}