const isAlphanumeric = (str) => /^[a-zA-Z0-9]+$/u.test(str)

const usernameValidator = (username) =>
  username.length >= 1 && isAlphanumeric(username)

export default usernameValidator
