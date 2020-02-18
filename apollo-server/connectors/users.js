function validateToken(token = '') {
  if (token) {
    return true
  } else {
    return false
  }
}

module.exports = {
  validateToken
}
