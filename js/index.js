
window.onload = function() {

  // If mouse up event occurs anywhere, execute stopLine function
  document.addEventListener("mouseup", CurrentLine.stopLine, false);

  var moduleslist = document.querySelector('.moduleslist > dl');
  new Menu(moduleslist);
  clearZone();

}
