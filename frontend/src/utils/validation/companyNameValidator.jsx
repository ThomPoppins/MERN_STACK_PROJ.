export default function companyNameValidator(name) {
  const nameRegex = /^[a-zA-Z0-9\s\-'.]{1,60}$/u
  return nameRegex.test(name)
}
