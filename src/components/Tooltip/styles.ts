import styled from 'styled-components';

export const Container = styled.div`
  position: relative;

  span {
    width: 160px;
    background: #ff9000;
    padding: 8px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;

    /* Propriedades para esconder o elemento */
    opacity: 1;
    transition: opacity 0.4s;
    visibility: hidden;

    position: absolute;
    bottom: calc(100% + 12px);
    left: 50%;
    transform: translateX(-50%);

    color: #312e38;

    &::before {
      content: ''; /* Para ser exibido em tela */
      border-style: solid;
      border-color: #ff9000 transparent;
      border-width: 6px 6px 0px 6px; /* Triângulo */
      top: 100%;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  &:hover span {
    opacity: 1; /* Para aparecer apenas quando passamos o mouse por cima */
    visibility: visible;
  }
`;
