import Point from 'point'
import Draggabilly from 'lib/dragabilly'
import Line from 'line'
import HashPoint from 'hash_point'
export default class Handle {
  constructor (container, name, args, style) {
    this.name = name
    this.args = args

    // create new draggable div
    this.elem = container.ownerDocument.createElement('div')
    this.elem.className = 'draggable'
    this.elem.style = style

    // create delete button if the block is not the workflow block
    if (this.name !== 'workflow') {
      var btnDelete = container.ownerDocument.createElement('img')
      btnDelete.className = 'btndelete'
      btnDelete.src = './images/close_pop.png'
      btnDelete.onclick = function (e) {
        if (confirm('Vous allez supprimer ce module')) {
          e.target.parentNode.jsObject.delete()
        }
      }
      this.elem.appendChild(btnDelete)
    }

    // create lebel text
    var p = container.ownerDocument.createElement('p')
    p.className = 'label'
    p.innerHTML = name
    this.elem.appendChild(p)

    // add handle to page
    container.appendChild(this.elem)

    // make the handle draggable
    this.draggie = new Draggabilly(this.elem, {
      // handle: '.handle',
      containment: '.zone'
    })

    // make the lines to update with the handle
    this.draggie.on('pointerMove', function (event, pointer, moveVector) {
      var zone = document.querySelector('.zone')
      var increment = 100
      var offsetWidth = zone.offsetWidth
      var offsetHeight = zone.offsetHeight
      var offsetLeft = zone.offsetLeft
      var offsetTop = zone.offsetTop
      var scrollLeft = zone.scrollLeft
      var scrollTop = zone.scrollTop
      var target = event.target
      while (!target.jsObject && target.className !== 'zone') {
        target = target.parentNode
      }
      // if draggie is near the border of zone --> replace the limit of zone
      if (((offsetWidth + offsetLeft) < (event.x + 100)) && moveVector.x > 0) {
        // if right border, move the limit point
        document.querySelector('.limitpoint').style.left = event.x - offsetLeft + scrollLeft + increment + 'px'
        zone.scrollLeft = scrollLeft + increment / 10
        if (target && target.jsObject) {
          target.jsObject.draggie.dragPoint.x = target.jsObject.draggie.dragPoint.x + increment / 10
          target.jsObject.draggie.positionDrag()
          // target.jsObject.addLeft(increment/10);
        }
      }
      if ((offsetLeft + 100 > event.x) && moveVector.x < 0) {
        if (scrollLeft < 100) {
        // if left border, move all draggies right
          Handle.each('addLeft', increment)
        } else {
          zone.scrollLeft = scrollLeft - increment / 10
        }
      }
      if ((offsetTop + 100 > event.y) && moveVector.y < 0) {
        if (scrollTop < 100) {
          // if top border, move all draggies bottom
          Handle.each('addTop', increment)
        } else {
          zone.scrollTop = scrollTop - increment / 10
        }
      }
      if ((offsetHeight + offsetTop) < (event.y + 100) && moveVector.y > 0) {
        // if bottom border, move limit point
        document.querySelector('.limitpoint').style.top = event.y - offsetTop + scrollTop + increment + 'px'
        zone.scrollTop = scrollTop + increment / 10
        if (target && target.jsObject) {
          target.jsObject.draggie.position.y = target.jsObject.draggie.position.y + increment / 10
          target.jsObject.addTop(increment / 10)
        }
      }
      Line.each('update') // updating all lines is faster than selecting the lines to be updated
    })

    this.draggie.on('dragEnd', function (event, pointer) {
      Line.each('update') // updating all lines is faster than selecting the lines to be updated
    })

    var inputIndxStart = 0
    // if the block is a workflow or a value, first field is an input
    if (this.name === 'workflow' || this.name === 'value') {
      // replace input point with a field
      this.inputField = container.ownerDocument.createElement('input')
      this.inputField.className = 'inputfield'
      this.inputField.type = 'text'
      this.elem.appendChild(this.inputField)
      inputIndxStart = 1
    }

    var type = 'in'
    // create the inputs points and save refs to them
    this.in = []
    var inPoints = args['inputs']
    var acceptMultipleConnections
    for (var i = inputIndxStart; i < inPoints.length; i++) {
      acceptMultipleConnections = (this.name === 'hash' || this.name === 'array')
      if (this.name === 'hash') {
        this.in.push(new HashPoint(this.elem, this, type, inPoints[i], acceptMultipleConnections))
      } else {
        this.in.push(new Point(this.elem, this, type, inPoints[i], acceptMultipleConnections))
      }
    }
    // if this is not a workflow, add an output
    if (this.name !== 'workflow') this.out = new Point(this.elem, this, 'out', false)

    // save ref to this js object in the dom elem
    this.elem.jsObject = this

    // update config

    Handle.all.push(this)
  }

  addEventListener (eventType, fn, disp) {
    this.elem.addEventListener(eventType, fn, disp)
  }

  // return true if the elem is located inside the handle
  contains (elem) {
    var rectPoint = this.elem.getBoundingClientRect()
    return (elem.x <= rectPoint.right) && (elem.x >= rectPoint.left) && (elem.y <= rectPoint.bottom) && (elem.y >= rectPoint.top)
  }

  // delte the current handle
  delete () {
    // delte output point
    if (this.out) this.out.delete()
    if (this.in) {
      // delte input points
      for (var i = this.in.length - 1; i >= 0; i--) {
        this.in[i].delete()
      }
    }
    // remove child from DOM
    this.elem.remove()
    // remove from static list
    i = 0
    while (Handle.all[i] !== this) { i++ }
    Handle.all.splice(i, 1)
  }

  serialize () {
    var json = {}
    json['type'] = this.args['type']
    if (this.args['name_arg']) json[this.args['name_arg']] = this.name
    var hashToComplete = json
    var jsonIndx = 0
    var ln = this.args['inputs'].length
    if (this.name === 'workflow' || this.name === 'value') {
      // what if the value should be numeric ?
      json[this.args['inputs'][jsonIndx]] = this.inputField.value
      ln = ln - 1
      jsonIndx++
    } else if (this.args['type'] === 'operation') {
      json['arguments'] = {}
      hashToComplete = json['arguments']
    }
    var i
    var otherSideHandles
    var j, ln2
    var inputName
    var hashKey
    for (i = 0; i < ln; i++) {
      inputName = this.args['inputs'][jsonIndx]
      otherSideHandles = this.getOtherSideHandles(this.in[i])
      ln2 = otherSideHandles.length
      if (ln2 === 0) {
        hashToComplete[inputName] = null
      } else if (this.name === 'array') {
        hashToComplete[inputName] = []
        for (j = 0; j < ln2; j++) {
          hashToComplete[inputName].push(otherSideHandles[j].serialize())
        }
      } else if (this.name === 'hash') {
        // hash case to be completed
        hashToComplete[inputName] = {}
        // TODO : get the name of the input in the hash
        for (j = 0; j < ln2; j++) {
          hashKey = this.in[i].label.value
          hashToComplete[inputName][hashKey] = (otherSideHandles[j].serialize())
        }
      } else if (ln2 === 1) {
        hashToComplete[inputName] = otherSideHandles[0].serialize()
      }
      jsonIndx++
    }
    return json
  }

  getOtherSideHandles (input) {
    return input.getOtherSideHandles()
  }

  setInputField (value) {
    if (this.inputField) { this.inputField.value = value }
  }

  setStyle (style) {
    var i
    var prop, val
    for (i in style) {
      prop = i
      val = style[i]
      this.elem.style[prop] = val
    }
  }

  addLeft (nbpx) {
    this.elem.style['left'] = parseFloat(this.elem.style['left'].replace('px', '')) + nbpx + 'px'
  }

  addTop (nbpx) {
    this.elem.style['top'] = parseFloat(this.elem.style['top'].replace('px', '')) + nbpx + 'px'
  }

  // execute fn function on each elem
  static each (fn, arg) {
    var l = Handle.all.length
    for (var i = l; i > 0; i--) {
      Handle.all[i - 1][fn](arg)
    }
  }

  // return the first point for wich le fn function return true
  static firstTo (fn, arg) {
    var l = Handle.all.length
    for (var i = 0; i < l; i++) {
      if (Handle.all[i][fn](arg)) {
        return Handle.all[i]
      }
    }
  }
}

Handle.all = []
Handle.currentHandle = null
