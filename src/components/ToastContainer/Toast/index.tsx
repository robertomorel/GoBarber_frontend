import React, { useCallback, useEffect } from 'react';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiXCircle,
} from 'react-icons/fi';

import { ToastMessage, useToast } from '../../../hooks/toast';
import { Container } from './styles';

interface ToastProps {
  message: ToastMessage;
  style: object;
}

const icons = {
  info: <FiInfo size={24} />,
  error: <FiAlertCircle size={24} />,
  success: <FiCheckCircle size={24} />,
};

const Toast: React.FC<ToastProps> = ({ message, style }) => {
  const { removeToast } = useToast();

  // -- Sempre que um novo toast for adicionado em tela, este hook é chamado
  // -- PAra que, após 3s de criado, o toast se auto delete.
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id);
    }, 3000);

    /**
     * No react, caso retornemos uma função no useEffcet, ela é executada automaticamente
     * caso o componente deixa de existir.
     *
     * Esta lógica vai ser usada para caso o usuário feche o toast antes dos 3s.
     */
    return () => {
      clearTimeout(timer);
    };
  }, [removeToast, message.id]);

  const handleRemoveToast = useCallback(
    (id: string) => {
      removeToast(id);
    },
    [removeToast],
  );

  return (
    <Container
      type={message.type}
      hasDescription={Number(!!message.description)}
      style={style}
    >
      {icons[message.type || 'info']}

      <div>
        <strong>{message.title}</strong>
        {!!message.description && <p>{message.description}</p>}
      </div>

      <button onClick={() => handleRemoveToast(message.id)} type="button">
        <FiXCircle size={18} />
      </button>
    </Container>
  );
};

export default Toast;
