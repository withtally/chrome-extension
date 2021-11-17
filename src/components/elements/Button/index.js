import React, { useState, useEffect } from 'react';
import { Button as StyledButton, ButtonText } from './styles';

const Button = ({onClick, children, ...rest}) => {
  return(
    <StyledButton onClick={onClick} {...rest}>
      {children}
    </StyledButton>
  )
}

Button.Text = ButtonText;

export default Button;