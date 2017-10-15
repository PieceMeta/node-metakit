function removePrefixedFromArray (array, stringPrefix = '_') {
  return array.filter(val => {
    return typeof val === 'string' ? val.indexOf(stringPrefix) === -1 : true
  })
}

export {
  removePrefixedFromArray
}
