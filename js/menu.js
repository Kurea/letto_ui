class Menu {
  constructor (container) {
    this.addFunctions(container, SUPPORTED_TYPES)
  }

  // add a function to the menu
  // type is dt or dd
  // name is the display name
  // event Listener optional to add an eventlistener
  addFunctionToMenu (container, fntype, functionName, eventListener) {
    var fn = container.ownerDocument.createElement(fntype)
    fn.innerHTML = functionName
    container.appendChild(fn)
    if (eventListener) {
      fn.addEventListener('click', eventListener)
    }
  }

  // add all functions to the menu
  addFunctions (container, table) {
    var i
    var ln = table.length
    var objectName
    for (i = 0; i < ln; i++) {
      objectName = table[i]
      // if arguments are described, it is a handle
      if (SUPPORTED_TYPES.indexOf(objectName) !== -1) {
        if (objectName !== 'workflow') {
          this.addFunctionToMenu(container, 'dt', objectName)
          // add all handler of this category
          this.addFunctions(container, SUPPORTED_CATEGORY_TYPES[objectName])
        }
      } else { // it is a category
        this.addFunctionToMenu(container, 'dd', objectName, this.addModuleOnMenuClick)
      }
    }
  }

  // add a module to the board
  static addModule (name, style) {
    var zone = document.querySelector('.zone')
    if (!style) {
      style = 'left:' + zone.scrollLeft + 'px; top:' + zone.scrollTop + 'px;'
    }
    return new Handle(zone, name, EXPECTED_HANDLE_ARGS[name], style)
  };

  addModuleOnMenuClick (e) {
    var name = e.target.innerHTML
    Menu.addModule(name)
  }
}
