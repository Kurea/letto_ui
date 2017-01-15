
window.onload = function() {

  // Create handles in the zone
  var zone = document.querySelector('.zone');
  new Handle(zone, 3);
  new Handle(zone, 3);
  new Handle(zone, 2);

  // If mouse up event occurs anywhere, execute stopLine function
  document.addEventListener("mouseup", CurrentLine.stopLine, false);

  var addfunction = function(elem, fntype, functionName) {
    var fn = document.createElement(fntype);
    fn.innerHTML = functionName;
    elem.appendChild(fn);
  }

  var addfunctions = function() {
    var moduleslist = document.querySelector('.moduleslist > dl');

    addfunction(moduleslist, 'dd', 'expression');

    addfunction(moduleslist, 'dt', 'Comparison');
    var SUPPORTED_COMPARISON_TYPES = Array("string_comparison","regex_comparison");
    for (var i = 0, ln = SUPPORTED_COMPARISON_TYPES.length; i<ln; i++) {
      addfunction(moduleslist, 'dd', SUPPORTED_COMPARISON_TYPES[i]);
    }

    addfunction(moduleslist, 'dt', 'Operations');
    var SUPPORTED_FUNCTION_NAMES = Array("add","api_call","map","min","convert","extract","get_linkedin_photo","gsub");
    for (var i = 0, ln = SUPPORTED_FUNCTION_NAMES.length; i<ln; i++) {
      addfunction(moduleslist, 'dd', SUPPORTED_FUNCTION_NAMES[i]);
    }

  }

  addfunctions();

}
