import Point from './point';
import Draggabilly from 'draggabilly';
import Line from './line';

export default class Handle {
  constructor (container, name, args, style) {
    this.name = name;
    this.args = args;

    // create new draggable div
    this.elem = container.ownerDocument.createElement('div');
    this.elem.className = 'draggable';
    this.elem.style = style;

    // create delete button if the block is not the workflow block
    if (this.name !== 'workflow') {
      var btnDelete = container.ownerDocument.createElement('img');
      btnDelete.className = 'btndelete';
      btnDelete.src = './images/close_pop.png';
      btnDelete.addEventListener('click', function (e) {
        if (confirm('Vous allez supprimer ce module')) {
          e.target.parentNode.jsObject.delete();
        }
      });
      this.elem.appendChild(btnDelete);
    }

    // create label text
    var p = container.ownerDocument.createElement('p');
    p.className = 'label';
    p.innerHTML = name;
    this.elem.appendChild(p);

    // add handle to page
    container.appendChild(this.elem);

    // make the handle draggable
    this.draggie = new Draggabilly(this.elem, {
      handle: '.draggable > *:not(input):not(img)',
      containment: '.zone'
    });

    // make the lines to update with the handle
    this.draggie.on('dragMove', function (event, pointer, moveVector) {
      var zone = document.querySelector('.zone');
      var increment = 100;
      var offsetWidth = zone.offsetWidth;
      var offsetHeight = zone.offsetHeight;
      var offsetLeft = zone.offsetLeft;
      var offsetTop = zone.offsetTop;
      var scrollLeft = zone.scrollLeft;
      var scrollTop = zone.scrollTop;
      var target = this.element;
      if (!target) return;
      // if draggie is near the border of zone --> replace the limit of zone
      if (((offsetWidth + offsetLeft) < (event.x + 100)) && moveVector.x > 0) {
        // if right border, move the limit point
        document.querySelector('.limitpoint').style.left = event.x - offsetLeft + scrollLeft + increment + 'px';
        zone.scrollLeft = scrollLeft + increment / 10;
        if (target && target.jsObject) {
          target.jsObject.draggie.dragPoint.x = target.jsObject.draggie.dragPoint.x + increment / 10;
          target.jsObject.draggie.positionDrag();
          target.jsObject.addSpace('left', increment/10);
        }
      }
      if ((offsetLeft + 100 > event.x) && moveVector.x < 0) {
        if (scrollLeft < 100) {
        // if left border, move all draggies right
          Handle.each('addSpace', 'left', increment);
        } else {
          zone.scrollLeft = scrollLeft - increment / 10;
        }
      }
      if ((offsetTop + 100 > event.y) && moveVector.y < 0) {
        if (scrollTop < 100) {
          // if top border, move all draggies bottom
          Handle.each('addSpace', 'top', increment);
        } else {
          zone.scrollTop = scrollTop - increment / 10;
        }
      }
      if ((offsetHeight + offsetTop) < (event.y + 100) && moveVector.y > 0) {
        // if bottom border, move limit point
        document.querySelector('.limitpoint').style.top = event.y - offsetTop + scrollTop + increment + 'px';
        zone.scrollTop = scrollTop + increment / 10;
        if (target && target.jsObject) {
          target.jsObject.draggie.position.y = target.jsObject.draggie.position.y + increment / 10;
          target.jsObject.addSpace('top', increment / 10);
        }
      }
      Line.each('update'); // updating all lines is faster than selecting the lines to be updated
    });

    this.draggie.on('dragEnd', function (event, pointer) {
      Line.each('update'); // updating all lines is faster than selecting the lines to be updated
      console.log();
    });

    var inputIndxStart = 0;
    // if the block is a workflow or a value, first field is an input
    if (this.name === 'workflow') {
      // replace input point with a field
      this.inputField = container.ownerDocument.createElement('input');
      this.inputField.className = 'inputfield';
      this.inputField.type = 'text';
      this.elem.appendChild(this.inputField);
      inputIndxStart = 1;
    }

    var inPoints = args['inputs'];
    this.createInputs(inPoints, inputIndxStart);

    // if this is not a workflow, add an output
    if (this.name !== 'workflow') this.out = new Point(this.elem, this, 'out', false);

    // save ref to this js object in the dom elem
    this.elem.jsObject = this;

    // update config

    Handle.all.push(this);
  }

  // create inputs points according to inPoints array
  createInputs(inPoints, inputIndxStart) {
    var type = 'in';
    // create the inputs points and save refs to them
    this.in = [];
    for (var i = inputIndxStart; i < inPoints.length; i++) {
      this.createPoint(type, inPoints[i]);
    }
  }

  // create a point with type (in or out) and name
  createPoint(type, name) {
    var acceptMultipleConnections;
    acceptMultipleConnections = (this.name === 'array');
    this.in.push(new Point(this.elem, this, type, name, acceptMultipleConnections));
  }

  // add event listener on the DOM elem
  addEventListener (eventType, fn, disp) {
    this.elem.addEventListener(eventType, fn, disp);
  }

  // delte the current handle
  delete () {
    // delte output point
    if (this.out) this.out.delete();
    if (this.in) {
      // delte input points
      for (var i = this.in.length - 1; i >= 0; i--) {
        this.in[i].delete();
      }
    }
    // remove child from DOM
    this.elem.remove();
    // remove from static list
    i = 0;
    while (Handle.all[i] !== this) { i++; }
    Handle.all.splice(i, 1);
  }

  // serialize the current handle
  serialize () {
    var json = {};
    json['type'] = this.args['type'];
    if (this.args['name_arg']) json[this.args['name_arg']] = this.name;
    var hashToComplete = json;
    var jsonIndx = 0;
    var ln = this.args['inputs'].length;
    if (this.name === 'workflow') {
      json[this.args['inputs'][jsonIndx]] = this.inputField.value;
      ln = ln - 1;
      jsonIndx++;
    } else if (this.args['type'] === 'operation') {
      json['arguments'] = {};
      hashToComplete = json['arguments'];
    }
    Object.assign(hashToComplete, this.serializeInputs(jsonIndx, ln));
    return json;
  }

  // serialize input number i of current handle
  serializeInputs(jsonIndx, ln){
    var i;
    var inputName;
    var hashToComplete = {};
    for (i = 0; i < ln; i++) {
      inputName = this.args['inputs'][jsonIndx];
      hashToComplete[inputName] = this.in[i].serialize();
      jsonIndx++;
    }
    return hashToComplete;
  }

  // set input field value (if exists)
  setInputField (value) {
    if (this.inputField) { this.inputField.value = value; }
  }

  // set the style css of the elem
  setStyle (style) {
    var i;
    var prop, val;
    for (i in style) {
      prop = i;
      val = style[i];
      this.elem.style[prop] = val;
    }
  }

  // Move handle from nbpx px in the pos direction
  addSpace (pos, nbpx) {
    this.elem.style[pos] = parseFloat(this.elem.style[pos].replace('px', '')) + nbpx + 'px';
    //console.log(this.elem.style[pos]);
  }

  // execute fn function on each elem
  static each (fn, ...arg) {
    var l = Handle.all.length;
    for (var i = l; i > 0; i--) {
      Handle.all[i - 1][fn](...arg);
    }
  }

  // return the first point for wich le fn function return true
  static firstTo (fn, args) {
    var l = Handle.all.length;
    for (var i = 0; i < l; i++) {
      if (Handle.all[i][fn](args)) {
        return Handle.all[i];
      }
    }
  }
}

Handle.all = [];
Handle.currentHandle = null;
