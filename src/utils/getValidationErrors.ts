import { ValidationError } from 'yup';

interface Errors {
  // --Significa que pode receber um ou vários campos com nome string de valor string.
  // -- Util para não precisar criar uma interface enorme a depender do formulário.
  [Key: string]: string;
}

export default function getValidationErrors(err: ValidationError): Errors {
  const validationErrors: Errors = {};

  // -- A lista de erros (array) da variável err (objeto) está dentro do "inner"
  err.inner.forEach(error => {
    validationErrors[error.path] = error.message;
  });

  return validationErrors;
}
