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

    this.inputType.addEventListener('input', e => this.testInput());
    this.inputField.addEventListener('input', e => this.testInput());
  }

  testInput() {
    var iValue = this.inputField.value;
    var iType = this.inputField.previousSibling.value;
    if ( (iType === 'number' && isNaN(parseFloat(iValue))) ||
      (iType === 'boolean' && (Boolean.parse(iValue) === undefined)) ) {
      this.inputField.className = 'inputfield error';
    }
    else {
      this.inputField.className = 'inputfield success';
    }
  }

  setInputField (value) {
    if (this.inputField) {
      this.inputField.value = value;
      this.inputType.value = (typeof value);
      this.testInput();
    }
  }

  serializeInput(i){
    var value = this.inputField.value;
    if (this.inputType.value == 'string') return value;
    if (this.inputType.value == 'number') return parseFloat(value);
    if (this.inputType.value == 'boolean') return Boolean.parse(value);
  }

  createInputs(inPoints, inputIndxStart) {
    super.createInputs(inPoints, inputIndxStart + 1);
  }

}
