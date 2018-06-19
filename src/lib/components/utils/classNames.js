export function classGetNames (element) { return element.className.split(/\s+/) }

export function classContains (element, classNames) {
  classNames = [].concat(classNames)
  const classList = classGetNames(element)
  for (const i in classNames) {
    if (classList.indexOf(classNames[i]) > -1) {
      return true
    }
  }
  return false
}

export function classAdd (element, className) {
  if (!classContains(element, className)) {
    element.className = [element.className, className].join(' ')
  }
}

export function classRemove (element, className) {
  const classList = classGetNames(element)
  element.className = classList.filter(name => name !== className).join(' ')
}

export function classToggle (element, className) {
  if (classContains(element, className)) {
    classRemove(element, className)
  } else {
    classAdd(element, className)
  }
}
