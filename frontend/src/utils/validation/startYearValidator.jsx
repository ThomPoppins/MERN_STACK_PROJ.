const startYearValidator = (startYear) => {
  const currentYear = new Date().getFullYear()
  const startYearInt = parseInt(startYear, 10)

  if (isNaN(startYearInt)) {
    return false
  }

  if (startYearInt > currentYear || startYearInt < 1) {
    return false
  }

  return true
}

export default startYearValidator
