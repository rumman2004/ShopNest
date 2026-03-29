export const validators = {
  required: (value) => {
    if (value === undefined || value === null || String(value).trim() === '') {
      return 'This field is required'
    }
    return true
  },

  email: (value) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!re.test(value)) return 'Enter a valid email address'
    return true
  },

  minLength: (min) => (value) => {
    if (String(value).length < min) return `Must be at least ${min} characters`
    return true
  },

  maxLength: (max) => (value) => {
    if (String(value).length > max) return `Must be at most ${max} characters`
    return true
  },

  password: (value) => {
    if (String(value).length < 8) return 'Password must be at least 8 characters'
    return true
  },

  positiveNumber: (value) => {
    if (isNaN(value) || Number(value) <= 0) return 'Must be a positive number'
    return true
  },

  nonNegativeNumber: (value) => {
    if (isNaN(value) || Number(value) < 0) return 'Must be 0 or greater'
    return true
  },

  confirmPassword: (password) => (value) => {
    if (value !== password) return 'Passwords do not match'
    return true
  },
}