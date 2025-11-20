// Input validation utilities (like Angular directives)

export const validateName = (value) => {
    // Only allow letters, spaces, and common name characters
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    return value === '' || nameRegex.test(value);
};

export const validatePhone = (value) => {
    // Only allow numbers, spaces, +, -, and ()
    const phoneRegex = /^[0-9\s+()-]*$/;
    return value === '' || phoneRegex.test(value);
};

export const validateEmail = (value) => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return value === '' || emailRegex.test(value);
};

export const validateNumber = (value) => {
    // Only allow numbers and decimal point
    const numberRegex = /^[0-9.]*$/;
    return value === '' || numberRegex.test(value);
};

export const validateAlphanumeric = (value) => {
    // Allow letters, numbers, and spaces
    const alphanumericRegex = /^[a-zA-Z0-9\s]*$/;
    return value === '' || alphanumericRegex.test(value);
};

// Input handlers to restrict character input
export const onlyLetters = (e) => {
    const char = String.fromCharCode(e.which);
    if (!/^[a-zA-Z\s'-]$/.test(char)) {
        e.preventDefault();
    }
};

export const onlyNumbers = (e) => {
    const char = String.fromCharCode(e.which);
    if (!/^[0-9]$/.test(char)) {
        e.preventDefault();
    }
};

export const onlyPhoneChars = (e) => {
    const char = String.fromCharCode(e.which);
    if (!/^[0-9+()-\s]$/.test(char)) {
        e.preventDefault();
    }
};

export const onlyAlphanumeric = (e) => {
    const char = String.fromCharCode(e.which);
    if (!/^[a-zA-Z0-9\s]$/.test(char)) {
        e.preventDefault();
    }
};

// Form validation helpers
export const isRequired = (value) => {
    return value !== null && value !== undefined && value.trim() !== '';
};

export const minLength = (value, min) => {
    return value.length >= min;
};

export const maxLength = (value, max) => {
    return value.length <= max;
};

export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
    // Indian phone number: 10 digits
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 15;
};

export const isValidAmount = (amount) => {
    return !isNaN(amount) && parseFloat(amount) > 0;
};

// Sanitize inputs
export const sanitizeName = (value) => {
    return value.replace(/[^a-zA-Z\s'-]/g, '');
};

export const sanitizePhone = (value) => {
    return value.replace(/[^0-9+()-\s]/g, '');
};

export const sanitizeNumber = (value) => {
    return value.replace(/[^0-9.]/g, '');
};

export const sanitizeAlphanumeric = (value) => {
    return value.replace(/[^a-zA-Z0-9\s]/g, '');
};
