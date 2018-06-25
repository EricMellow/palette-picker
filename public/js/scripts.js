setRandomColors()

var $generateBtn = $('.generator-btn')

$generateBtn.on('click', setRandomColors);

function randomColorGenerator() {
  const value1 = Math.floor(Math.random() * 255)
  const value2 = Math.floor(Math.random() * 255)
  const value3 = Math.floor(Math.random() * 255)

  return `rgba(${value1}, ${value2}, ${value3})`
}

function setRandomColors() {
  $('.color1').css("background-color", randomColorGenerator)
  $('.color2').css("background-color", randomColorGenerator)
  $('.color3').css("background-color", randomColorGenerator)
  $('.color4').css("background-color", randomColorGenerator)
  $('.color5').css("background-color", randomColorGenerator)
}