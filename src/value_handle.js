import Handle from './handle';
import './index';

export default class ValueHandle extends Handle {
  constructor (container, name, args, style) {
    super(container, name, args, style);
    // replace input point with a field
    this.inputType = container.ownerDocument.createElement('select');
    this.inputType.className = 'inputfield';
    var opts = ['String', 'Boolean', 'Number'];
    for (let i in opts) {
      let opt = container.ownerDocument.createElement('option');
      opt.value = opts[i].toLowerCase();
      opt.innerHTML = opts[i];
      this.inputType.appendChild(opt);
    }
    this.elem.appendChild(this.inputType);

    this.inputField = container.ownerDocument.createElement('input');
    this.inputField.className = 'inputfield';
    this.inputField.type = 'text';
    this.elem.appendChild(this.inputField);

    this.inputTT = container.ownerDocument.createElement('span');
    this.inputTT.className = 'tooltiptext tooltip-bottom';
    this.elem.appendChild(this.inputTT);

    this.inputType.addEventListener('input', e => this.setInputStyle());
    this.inputField.addEventListener('input', e => this.setInputStyle());
  }

  // validate the value of the input
  testInput() {
    var iValue = this.inputField.value;
    var iType = this.inputType.value;
    if (iType === 'number') return !isNaN(parseFloat(iValue));
    if (iType === 'boolean') return (Boolean.parse(iValue) !== undefined);
    return true;
  }

  setInputStyle(){
    if (this.testInput()) {
      this.inputField.className = 'inputfield success';
      this.inputTT.style.visibility = 'hidden';
      this.inputTT.style.opacity = 0;
    }
    else {
      this.inputField.className = 'inputfield error';
      this.inputTT.style.visibility = 'visible';
      this.inputTT.style.opacity = 1;
      this.inputTT.innerHTML = 'This is not a ' + this.inputType.value;
    }
  }

  // set the value of the input field if present
  setInputField (value) {
    if (this.inputField) {
      this.inputField.value = value;
      this.inputType.value = (typeof value);
      this.setInputStyle();
    }
  }

  // serialize input number i of current handle
  serializeInputs(jsonIndx, ln){
    var hashToComplete = {};
    var inputName = this.args['inputs'][jsonIndx];
    hashToComplete[inputName] = this.getParsedVal();
    return hashToComplete;
  }

  // serialize the value
  getParsedVal(){
    var value = this.inputField.value;
    if (this.inputType.value == 'string') return value;
    if (this.inputType.value == 'number') return parseFloat(value);
    if (this.inputType.value == 'boolean') return Boolean.parse(value);
  }

  // create input
  createInputs(inPoints, inputIndxStart) {
    super.createInputs(inPoints, inputIndxStart + 1);
  }

}
