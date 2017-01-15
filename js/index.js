
window.onload = function() {

  // If mouse up event occurs anywhere, execute stopLine function
  document.addEventListener("mouseup", CurrentLine.stopLine, false);

  var moduleslist = document.querySelector('.moduleslist > dl');
  new Menu(moduleslist);

  document.querySelector('.my_btn_close').addEventListener("click", function(e) {
    document.querySelector('#modale').style.display = 'none';
    document.querySelector('#deletemodule').onclick = function(e) {  };
    Handle.currentHandle = null;
  });
}
