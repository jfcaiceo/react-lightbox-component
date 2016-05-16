const classNames = {
  getNames: (element) => element.className.split(/\s+/),
  contains (element, classNames) {
    classNames = [].concat(classNames)
    const classList = this.getNames(element)
    for (const i in classNames) {
      if (classList.indexOf(classNames[i]) > -1) {
        return true
      }
    }
    return false
  },
  add (element, className) {
    if (!this.contains(element, className)) {
      element.className = [element.className, className].join(' ')
    }
  },
  remove (element, className) {
    const classList = this.getNames(element)
    element.className = classList.filter(name => name !== className).join(' ')
  },
  toggle (element, className) {
    if (this.contains(element, className)) {
      this.remove(element, className)
    } else {
      this.add(element, className)
    }
  }
}

module.exports = classNames
