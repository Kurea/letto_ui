import { SUPPORTED_TYPES, SUPPORTED_CATEGORY_TYPES, EXPECTED_HANDLE_ARGS } from './api';
import Handle from './handle';
import HashHandle from './hash_handle';
import ValueHandle from './value_handle';

export default class Menu {
  constructor (container) {
    this.addFunctions(container, SUPPORTED_TYPES);
  }

  // add a function to the menu
  // type is dt or dd
  // name is the display name
  // event Listener optional to add an eventlistener
  addFunctionToMenu (container, fntype, functionName, eventListener) {
    var fn = container.ownerDocument.createElement(fntype);
    fn.innerHTML = functionName;
    container.appendChild(fn);
    if (eventListener) {
      fn.addEventListener('click', eventListener);
    }
  }

  // add all functions to the menu
  addFunctions (container, table) {
    var i;
    var ln = table.length;
    var objectName;
    for (i = 0; i < ln; i++) {
      objectName = table[i];
      // if arguments are described, it is a handle
      if (SUPPORTED_TYPES.indexOf(objectName) !== -1) {
        if (objectName !== 'workflow') {
          this.addFunctionToMenu(container, 'dt', objectName);
          // add all handler of this category
          this.addFunctions(container, SUPPORTED_CATEGORY_TYPES[objectName]);
        }
      } else { // it is a category
        this.addFunctionToMenu(container, 'dd', objectName, this.addModuleOnMenuClick);
      }
    }
  }

  // add a module to the board
  static addModule (name, style) {
    var zone = document.querySelector('.zone');
    if (!style) {
      style = 'left:' + zone.scrollLeft + 'px; top:' + zone.scrollTop + 'px;';
    }
    if (name === 'hash') {
      return new HashHandle(zone, name, EXPECTED_HANDLE_ARGS[name], style);
    } else if (name === 'value') {
      return new ValueHandle(zone, name, EXPECTED_HANDLE_ARGS[name], style);
    } else {
      return new Handle(zone, name, EXPECTED_HANDLE_ARGS[name], style);
    }
  }

  addModuleOnMenuClick (e) {
    var name = e.target.innerHTML;
    Menu.addModule(name);
  }
}
