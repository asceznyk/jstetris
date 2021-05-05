const deepCopy = (objectin) => {
  let outobject, value, key

  if (typeof objectin !== "object" || objectin === null) {
    return objectin // Return the value if objectin is not an object
  }

  // Create an array or object to hold the values
  outobject = Array.isArray(objectin) ? [] : {}

  for (key in objectin) {
    value = objectin[key]

    // Recursively (deep) copy for nested objects, including arrays
    outobject[key] = deepCopy(value)
  }

  return outobject
}
