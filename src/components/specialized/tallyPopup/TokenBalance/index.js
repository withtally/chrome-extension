import React from 'react';
import styled from 'styled-components';
import Spacer from '../../../materials/Spacer';
import Subtitle from '../../../text/Subtitle';
import Title from '../../../text/Title';
import Color from 'color';

const TokenBalance = ({ name, symbol, balance }) => {
  return (
    <Container title={name}>
      <Content>
        <Subtitle>{symbol}</Subtitle>
        <Spacer height="4px" />
        <Title title={balance}>{balance}</Title>
      </Content>
    </Container>
  );
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  overflow: hidden;
`;

const Container = styled.a`
  background-color: ${(props) =>
    props.hovered
      ? Color(props.theme.lightBackground).darken(0.08).rgb().string()
      : props.theme.lightBackground};
  padding: 10px 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
`;

export default TokenBalance;
