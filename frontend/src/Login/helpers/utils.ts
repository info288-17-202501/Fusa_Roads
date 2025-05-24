export const validateUsername = (username: string): string[] => {
    const errors: string[] = [];

    const minLength = 5;
    const maxLength = 20;
    const validChars = /^[a-zA-Z0-9._-]+$/;

    if (username.length < minLength) errors.push(`Debe tener al menos ${minLength} caracteres`)
    if (username.length > maxLength) errors.push(`Debe tener como máximo ${maxLength} caracteres`)
    if (!validChars.test(username)) errors.push(`Solo se permiten letras, punto y guión (-, _)`)
    if (/^[._-]/.test(username)) errors.push(`No puede comenzar con "${username[0]}"`)
    if (/[._-]$/.test(username)) errors.push(`No puede terminar con "${username[username.length - 1]}"`)

    return errors;
};

// referencia  => https://github.com/Husdady/validar-formulario
export const validateEmail = (email: string) => {
    let error = "";
    const isValidEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if (!isValidEmail.test(email)) {
        error = 'Ingresa un correo electrónico válido.';
    }
    
    return error;
};

export const validatePassword = (psw: string): string[] => {
    const regexMin = /[a-z]/;
    const regexMay = /[A-Z]/;
    const regexNum = /\d/;
    const minLargo = 8;

    const validLargo = psw.length >= minLargo;
    const minusculas = regexMin.test(psw);
    const mayusculas = regexMay.test(psw);
    const numeros = regexNum.test(psw);

    const errors: string[] = [];

    if (!validLargo) errors.push(`Mínimo ${minLargo} caracteres.`);
    if (!minusculas) errors.push('Al menos una letra minúscula.');
    if (!mayusculas) errors.push('Al menos una letra mayúscula.');
    if (!numeros) errors.push('Al menos un número.');

    return errors;
};