const SUPPORTED_COMPARISON_TYPES = ["string_comparison","regex_comparison"];
const SUPPORTED_FUNCTION_NAMES = ["add","api_call","map","min","convert","extract","get_linkedin_photo","gsub"];
const EXPECTED_ARGS = {
  "add": ["*+"],
  "api_call": ["expression","expression","[payload]"],
  "map": ["*","*"],
  "min": ["*+"],
  "convert": ["expression","*"],
  "extract": ["expression","*"],
  "get_linkedin_photo": ["*"],
  "gsub": ["*","expression","expression","expression"]
}

class Menu {
  constructor(container) {
    this.addfunctions(container);
  }

  // add a function to the menu
  // type is dt or dd
  // name is the display name
  // event Listener optional to add an eventlistener
  addfunction(container, fntype, functionName, eventListener) {
    var fn = container.ownerDocument.createElement(fntype);
    fn.innerHTML = functionName;
    container.appendChild(fn);
    if (eventListener) {
      fn.addEventListener("click", eventListener);
    }
  }

  // add all dunctions to the menu
  addfunctions(container) {
    this.addfunction(container, 'dd', 'expression', this.addExpressionModule);

    this.addfunction(container, 'dt', 'Comparison');
    for (var i = 0, ln = SUPPORTED_COMPARISON_TYPES.length; i<ln; i++) {
      this.addfunction(container, 'dd', SUPPORTED_COMPARISON_TYPES[i], this.addComparisonModule);
    }

    this.addfunction(container, 'dt', 'Operations');
    for (var i = 0, ln = SUPPORTED_FUNCTION_NAMES.length; i<ln; i++) {
      this.addfunction(container, 'dd', SUPPORTED_FUNCTION_NAMES[i], this.addOperationModule);
    }

  }

  // add a module to the board
  static addModule(name, inputs) {
    var zone = document.querySelector('.zone');
    new Handle(zone, name, inputs);
  }

  // add an expression handle to the board
  addExpressionModule(e) {
    Menu.addModule("expression", 0);
  }

  // add an operation handle to the board
  addOperationModule(e) {
    var moduleToAdd = e.target.innerHTML;
    var args = EXPECTED_ARGS[moduleToAdd];
    Menu.addModule( moduleToAdd, args);
  }

  // add a comparisonModule to the board
  addComparisonModule(e) {
    var moduleToAdd = e.target.innerHTML;
    Menu.addModule(moduleToAdd, 2);
  }
}
