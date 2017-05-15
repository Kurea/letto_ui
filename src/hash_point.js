import Point from './point';

export default class HashPoint extends Point {
  constructor (container, handle, type, name, acceptMultipleConnections) {
    super(container, handle, type, name, acceptMultipleConnections);
    this.elem.removeChild(this.label);
    this.label = container.ownerDocument.createElement('input');
    this.label.className = 'inputname';
    this.label.type = 'text';
    this.elem.appendChild(this.label);

    this.label.addEventListener('focus', e => this.handle.setUpdateMode());

    this.label.addEventListener('blur', e => this.handle.removeUpdateMode());
  }

  //remove the remove button
  removeBtnRemove() {
    if(this.hasBtnRemove()) {
      this.label.previousSibling.remove();
      this.btnRemove = null;
    }
  }

  //add the remove button
  addBtnRemove() {
    if (!this.hasBtnRemove()) {
      this.btnRemove = this.elem.ownerDocument.createElement('img');
      this.btnRemove.className = 'btnremoveinput';
      this.btnRemove.src = './images/close_pop.png';
      this.btnRemove.addEventListener('click', e => this.removeMe());
      this.elem.insertBefore(this.btnRemove, this.label);
    }
  }

  //test if the remove button is present
  hasBtnRemove() {
    return (this.btnRemove !== undefined && this.btnRemove !== null);
  }

  // remove this input
  removeMe() {
    var handle = this.handle;
    if (confirm('Vous allez supprimer cette entrée')) {
      var pointI = handle.removePoint(this);
      if (pointI > 0) {
        handle.in[pointI - 1].label.focus();
      } else if (handle.in[0]) {
        handle.in[0].label.focus();
      } else if (handle.tempInput) {
        handle.tempInput.label.focus();
      } else {
        handle.addTempInput();
        handle.tempInput.label.focus();
      }
    } else {
      this.label.focus();
    }

  }

  serialize(){
    var values = {};
    var hashKey = this.label.value;
    var otherSideHandles = this.getOtherSideHandles();
    values[hashKey] = (otherSideHandles[0].serialize());
    return values;
  }

}
