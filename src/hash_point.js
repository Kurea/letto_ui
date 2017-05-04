import Point from './point';
import Handle from './handle';

export default class HashPoint extends Point {
  constructor (container, handle, type, name, acceptMultipleConnections) {
    super(container, handle, type, name, acceptMultipleConnections);
    this.elem.removeChild(this.label);
    this.label = container.ownerDocument.createElement('input');
    this.label.className = 'inputname';
    this.label.type = 'text';
    this.label.value = this.name;
    this.elem.appendChild(this.label);

    this.label.addEventListener('focus', function (e) {
      var handle = Handle.getDOM(e.target).jsObject;
      handle.addAllBtnRemove();
      if (handle.hasTempInput()) {
        if (e.target.ownerDocument.activeElement === handle.tempInput.label) {
          handle.tempInput.addBtnRemove();
          handle.in.push(handle.tempInput);
          handle.tempInput = null;
        }
      }
      handle.addTempInput();
    });

    this.label.addEventListener('blur', function (e) {
      // to permit clicking on the other objects created
      setTimeout(() => {
        var handleDOM = Handle.getDOM(e.target);
        var newActiveZone = Handle.getDOM(document.activeElement);
        // if we left the hande
        if (handleDOM && (handleDOM !== newActiveZone) && handleDOM.jsObject) {
          var handle  = handleDOM.jsObject;
          handle.removeAllBtnRemove();
          handle.removeTempInput();
        }
      }, 125);
    });
  }

  removeBtnRemove() {
    if(this.hasBtnRemove()) {
      this.label.previousSibling.remove();
      this.btnRemove = null;
    }
  }

  addBtnRemove() {
    if (!this.hasBtnRemove()) {
      this.btnRemove = this.elem.ownerDocument.createElement('img');
      this.btnRemove.className = 'btnremoveinput';
      this.btnRemove.src = './images/close_pop.png';
      this.btnRemove.addEventListener('click', e => this.removeMe());
      this.elem.insertBefore(this.btnRemove, this.label);
    }
  }

  hasBtnRemove() {
    return (this.btnRemove !== undefined && this.btnRemove !== null);
  }

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
}
