/*
 * Validates a Dutch phone number.
 *
 * @param {string} phoneNumber - The phone number to validate.
 * @returns {boolean} - True if the phone number is valid, false otherwise.
 */
const validateNLPhoneNumber = (phoneNumber) => {
  const regex = /^(?:\+31|0)(?:[1-9][0-9]?|6(?:[0-9]\s?){7,10})$/u
  return regex.test(phoneNumber)
}

const phoneNumberValidator = (phoneNumber, countryCode) => {
  switch (countryCode) {
    case 'NL':
      return validateNLPhoneNumber(phoneNumber)
    default:
      return false
  }
}

export default phoneNumberValidator
