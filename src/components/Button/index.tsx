import React, { InputHTMLAttributes, ButtonHTMLAttributes } from 'react';

import { boolean } from 'yup';
import { Container } from './styles';

// interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, loading, ...rest }) => (
  <Container type="button" {...rest}>
    {/* Para que todo o conteúdo do botão seja herdado. Neste caso, apenas o nome */}
    {loading ? 'Carregando...' : children}
  </Container>
);

export default Button;
