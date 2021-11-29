/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from 'react';
import { Button as StyledButton, ButtonText } from './styles';

const Button = function ({ onClick, children, ...rest }) {
  return (
    <StyledButton onClick={onClick} {...rest}>
      {children}
    </StyledButton>
  );
};

Button.Text = ButtonText;

export default Button;
