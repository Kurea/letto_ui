import Handle from './handle';
import HashPoint from './hash_point';

export default class HashHandle extends Handle {
  constructor (container, name, args, style) {
    super(container, name, args, style);
  }

  createPoint(type, inPoint) {
    this.in.push(new HashPoint(this.elem, this, type, inPoint, true));
  }

  addInputValue(value) {
    this.in.push(new HashPoint(this.elem, this, 'in', value, false));
  }

  removeAllBtnRemove() {
    var point;
    for (point of this.in) {
      point.removeBtnRemove();
    }
  }

  addAllBtnRemove() {
    var point;
    for (point of this.in) {
      point.addBtnRemove();
    }
  }

  hasTempInput(){
    return (this.tempInput !== undefined && this.tempInput !== null);
  }

  addTempInput() {
    if(!this.hasTempInput()) {
      this.tempInput = new HashPoint(this.elem, this, 'in', '', false);
    }
  }

  removeTempInput() {
    if(this.hasTempInput()) {
      this.tempInput.delete();
      this.tempInput = null;
    }
  }

  removePoint(point) {
    var i = 0;
    while (this.in[i] !== point) { i++; }
    this.in[i].delete();
    this.in.splice(i, 1);
  }

  removePointById(id) {
    if (this.in[id]) {
      this.in[id].delete();
      this.in.splice(id, 1);
    }
  }
}
