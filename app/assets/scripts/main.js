//import 'npm:jquery/dist/jquery.js';
//import 'npm:react/dist/react.min.js';

'use strict';

$(document).ready(function () {
  var z_range = document.querySelector('#chroma');
  var picker = document.querySelector('#lch-picker');
  var time = document.querySelector('#time');

  z_range.value = 30;
  drawLchPicker(30, picker)

  $(z_range).on('change', redrawPicker)

  function redrawPicker () {
    drawLchPicker(parseInt(z_range.value), picker)
  }
})

function setPixel(data, x, y, max_x, color) {
  var pos = (y*max_x*4) + x*4
  data[pos+0] = color[0]
  data[pos+1] = color[1]
  data[pos+2] = color[2]
  data[pos+3] = color[3] * 255
}

function drawLchPicker(z, picker) {
  console.log('drawing', z)
  var size = { l:100, h:360, c:150 }
  var m = { y: 'c', x: 'h', z: 'l' }

  var ctx = picker.getContext("2d");

  var image = ctx.createImageData(size[m.x], size[m.y])
  var data = image.data
  var c = {h: 0, c: 0, l: 0 }
  c[m.z] = z

  while (c[m.y] < size[m.y]) {
    var rgb = alchemist.lchab(c.l, c.c, c.h).rgb()
    if (rgb) rgb.push(1)
    else {
      rgb = [35,35,35,0]
    }
    setPixel(data, c[m.x], c[m.y], size[m.x], rgb)
    c[m.x]++;
    if (c[m.x] == size[m.x]) {
      c[m.y]++; c[m.x] = 0
    }
  }
  ctx.putImageData(image, 0, 0)
  //ctx.drawImage(picker,0,0, picker.width*2, picker.height)
}

/*
function drawRgbPicker (picker) {
  var size = 360

  var ctx = picker.getContext("2d");

  var image = ctx.createImageData(size, size)
  var data = image.data
  var l = 0, h = 0, c=20;
  while (h < size) {
    var rgb = alchemist.lchab(l, c, h).rgb()
    if (rgb) rgb.push(1)
    else rgb = [255, 255, 255, 1]
    //console.log(l,h,rgb)
    setPixel(data, l, h, size, rgb)
    l++;
    if (l == size) {
      h++; l = 0
    }
  }
  ctx.putImageData(image, 0, 0)
}
*/
