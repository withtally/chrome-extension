import React from 'react';
import styled from 'styled-components';

const SeeMore = ({url, ...rest}) => {
  return(
    <Anchor href={url} target="_blank" rel="noopener noreferrer" {...rest}>
      See More
    </Anchor>
  )
}

const Anchor = styled.a`
  align-self: flex-end;
  color: ${props => props.theme.primary};
  font-family: Montserrat;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  /* identical to box height */

  display: flex;
  align-items: center;
  text-align: right;
  letter-spacing: 0.25px;
  padding: 4px;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background-color: ${props => props.theme.grey100}
  }
  
`

export default SeeMore;