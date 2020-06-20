import React from 'react';
import { useTransition } from 'react-spring';

import { Container } from './styles';
import Toast from './Toast';
import { ToastMessage } from '../../hooks/toast';

interface ToastContainerProps {
  messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
  /**
   * Lógica para criar uma animação de transição nos Toasts.
   * Usa a biblioteca "react-spring".
   *
   * Observar as mudanças feitas no "messages.map"
   */
  const messagesWithTransations = useTransition(
    messages,
    message => message.id,
    {
      from: { right: '-120%', opacity: 0, transform: 'rotateZ(270deg)' },
      enter: { right: '0%', opacity: 1, transform: 'rotateZ(360deg)' },
      leave: { right: '-120%', opacity: 0, transform: 'rotateZ(270deg)' },
    },
  );

  return (
    <Container>
      {!!messagesWithTransations &&
        messagesWithTransations.map(({ item, key, props }) => (
          <Toast key={key} style={props} message={item} />
        ))}
    </Container>
  );
};

export default ToastContainer;
