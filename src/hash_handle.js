import Handle from './handle';
import HashPoint from './hash_point';
import Line from './line';

export default class HashHandle extends Handle {
  constructor (container, name, args, style) {
    super(container, name, args, style);
  }

  // create a point with type (in or out) and name
  createPoint(type, inPoint) {
    this.in.push(new HashPoint(this.elem, this, type, inPoint, true));
  }

  // add a new input point
  addInputValue(value) {
    this.in.push(new HashPoint(this.elem, this, 'in', value, false));
  }

  // set display to update mode  : add remove buttons and temp input
  setUpdateMode() {
    if (this.hasTempInput()) {
      if (document.activeElement === this.tempInput.label) {
        this.tempInput.addBtnRemove();
        this.in.push(this.tempInput);
        this.tempInput = null;
        this.addTempInput();
      }
    } else {
      this.addAllBtnRemove();
      this.addTempInput();
    }
  }

  // remove update mode : remove remove buttons and temp input
  // (timeout to permit clicking on other handle elements)
  removeUpdateMode() {
    setTimeout(() => {
      // if we left the hande
      if (!this.elem.contains(document.activeElement)) {
        this.removeAllBtnRemove();
        this.removeTempInput();
      }
    }, 150);
  }

  // remove remove buttons on all inputs
  removeAllBtnRemove() {
    var point;
    for (point of this.in) {
      point.removeBtnRemove();
    }
  }

  // add remove buttons on all inputs
  addAllBtnRemove() {
    var point;
    for (point of this.in) {
      point.addBtnRemove();
    }
  }

  // test if handle has a temp input
  hasTempInput(){
    return (this.tempInput !== undefined && this.tempInput !== null);
  }

  // add the temp input
  addTempInput() {
    if(!this.hasTempInput()) {
      this.tempInput = new HashPoint(this.elem, this, 'in', '', false);
    }
  }

  // remove the temp input
  removeTempInput() {
    if(this.hasTempInput()) {
      this.tempInput.delete();
      this.tempInput = null;
    }
  }

  // remove designated input (DOM elem)
  removePoint(point) {
    var i = 0;
    while (this.in[i] !== point) { i++; }
    this.in[i].delete();
    this.in.splice(i, 1);
    Line.each('update');
    return i;
  }

  // remove designated input (input id)
  removePointById(id) {
    if (this.in[id]) {
      this.in[id].delete();
      this.in.splice(id, 1);
    }
  }

  //serialize all inputs of the handle
  serializeInputs(jsonIndx, ln){
    var hashToComplete = {};
    var inputName = this.args['inputs'][jsonIndx];
    var values = {};
    var inPoint;
    for (inPoint of this.in) {
      Object.assign(values, inPoint.serialize());
    }
    hashToComplete[inputName] = values;
    return hashToComplete;

  }
}
