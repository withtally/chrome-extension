import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Spacer from '../../../materials/Spacer';
import Subtitle from '../../../text/Subtitle';
import Title from '../../../text/Title';
import formatDistance from 'date-fns/formatDistance'
import { MdChevronRight } from 'react-icons/md';
import Color from 'color';

const RecentTransaction = ({direction, href, value, timestamp}) => {
  const [hovered, setHovered] = useState(false);
  return(
    <Container
      href={href} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} hovered={hovered}>
      <Content>
        <Tag direction={direction}>
          {direction}
        </Tag>
        <Spacer height="8px" />
        <Title>{value /= Math.pow(10, 18)} Ether</Title>
        <Spacer height="2px" />
        <Subtitle>{formatDistance(timestamp * 1000, new Date())} ago</Subtitle>
      </Content>
      <ArrowContainer hovered={hovered}>
        <MdChevronRight color={hovered ? 'white' : 'black'} size="32px" />
      </ArrowContainer>
    </Container>
  )
}

const ArrowContainer = styled.div`
  width: 56px;
  height: 56px;
  background-color: ${props => props.hovered ? props.theme.primary : "rgba(0,0,0,0.02)" };
  border-radius: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
`

const Tag = styled.div`
  background-color: ${props => props.direction === 'IN' ? props.theme.accent1 : props.theme.accent2};
  padding: 4px 10px;
  border-radius: 4px;

  font-family: Montserrat;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  letter-spacing: 0.25px;

  color: #FFFFFF;
`

const Container = styled.a`
  background-color: ${props => props.hovered ? Color(props.theme.lightBackground).darken(0.08).rgb().string() : props.theme.lightBackground};
  padding: 10px 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
`;

export default RecentTransaction;