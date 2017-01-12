
window.onload = function() {

  // Create handles in the zone
  var zone = document.querySelector('.zone');
  new Handle(zone, 3);
  new Handle(zone, 3);
  new Handle(zone, 2)

  // If mouse up event occurs anywhere, execute stopLine function
  document.addEventListener("mouseup", CurrentLine.stopLine, false);
}
