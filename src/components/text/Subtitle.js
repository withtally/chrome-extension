import React from 'react';
import styled from 'styled-components';

const Subtitle = ({ children, ...rest }) => {
  return <Span {...rest}>{children}</Span>;
};

const Span = styled.span`
  font-family: Montserrat;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;

  display: flex;
  align-items: center;
  letter-spacing: 0.25px;

  color: #000000;
`;

export default Subtitle;
