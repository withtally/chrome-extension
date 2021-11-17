import React from 'react';
import styled from 'styled-components';

const Title = ({children, ...rest}) => {
  return(
    <Span {...rest}>{children}</Span>
  )
}

const Span = styled.span`
  font-family: Montserrat;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  /* identical to box height */

  display: flex;
  align-items: center;
  letter-spacing: 0.25px;
`

export default Title;