import React, {
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { useField } from '@unform/core';
/**
 * Usado o IconBaseProps para que o ícone passado como propriedade possa ter
 * acesso às propriedade do react-icons
 * */
import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';

import { Container, Error } from './styles';

// import Tooltip from '../Tooltip';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  containerStyle?: object;
  icon?: React.ComponentType<IconBaseProps>; // -- Adicionando um novo componente no input
}

const Input: React.FC<InputProps> = ({
  name,
  containerStyle,
  icon: Icon,
  ...rest
}) => {
  // -- Para ter a referência do elemento input na DOM. UseRef vai começar com null.
  const inputRef = useRef<HTMLInputElement>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  /**
   * "useField" -> Hook disponível que recebe como parâmetro o nome do campo ("name")
   *               e retorna várias propriedades.
   *   Props:
   *       name: nome do campo do input
   *       ref: para ter a referência do elemento na DOM. Desta forma conseguimos
   *            acessar qlqr propriedade nativa do JS. Onvalue, Onfocus, etc.
   *            "inputRef.current" -> input. Padão do react.
   *            É o que dá acesso ao input no HTML
   *       path: onde o unform vai buscar o valor do input.
   *             Na DOM seria: "document.querySelector('input').value"
   *             Logo, o vlaor do campo é "value"
   */
  const { fieldName, defaultValue, error, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  /**
   * Sempre que existe uma função dentro de outro no JS, sempre que a função principal
   * é chamada, a segunda dentro dela é novamente armazenada em memória.
   * Isso pode sar um prejuízo em memódia.
   * "useCallback" é um hook do React Native para que uma função dentro de outra
   * sejam salvas em memória sem precisar recarregar.
   *   - Apenas é regarregada em memória caso os parâmetros passados no [] mudem.
   *
   * Regra: sempre usar o "useCallback" caso sejam usados uma função dentro de
   * outra função ou componente.
   */
  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    // -- "inputRef.current?.value" == "inputRef.current && inputRef.current.value"
    setIsFilled(!!inputRef.current?.value);
  }, []);

  // -- Garantir também que esta função apenas seja alocada em memória uma vez
  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  return (
    <Container
      style={containerStyle}
      isErrored={!!error}
      isFocused={isFocused}
      isFilled={isFilled}
    >
      {Icon && <Icon size={20} />}
      <input
        defaultValue={defaultValue}
        ref={inputRef}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        {...rest}
      />

      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </Container>
  );
};

export default Input;
