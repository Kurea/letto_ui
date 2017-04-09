class HashPoint extends Point {
  constructor (container, handle, type, name, acceptMultipleConnections) {
    super(container, handle, type, name, acceptMultipleConnections)
    this.elem.removeChild(this.label)
    this.label = container.ownerDocument.createElement('input')
    this.label.className = 'inputname'
    this.label.type = 'text'
    this.label.value = this.name
    this.elem.appendChild(this.label)
  }
}
