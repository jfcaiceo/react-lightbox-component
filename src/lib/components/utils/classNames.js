export function classGetNames (element) {
  if((typeof element.className) !== 'string' )
    return []
  return element.className.split(/\s+/)
}

export function containsClass (element, classNames) {
  classNames = [].concat(classNames)
  const classList = classGetNames(element)
  for (const i in classNames) {
    if (classList.indexOf(classNames[i]) > -1) {
      return true
    }
  }
  return false
}

export function addClass (element, className) {
  if (!containsClass(element, className)) {
    element.className = [element.className, className].join(' ')
  }
}

export function removeClass (element, className) {
  const classList = classGetNames(element)
  element.className = classList.filter(name => name !== className).join(' ')
}

export function classToggle (element, className) {
  if (containsClass(element, className)) {
    removeClass(element, className)
  } else {
    addClass(element, className)
  }
}
