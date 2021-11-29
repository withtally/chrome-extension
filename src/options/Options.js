import React from 'react';
import styled from 'styled-components';
import { ReactComponent as TallyLogo } from '../assets/logo.svg';
import Spacer from '../components/materials/Spacer';

const Options = function () {
  return (
    <ScreenContainer>
      <Content>
        <Logo />
        <Spacer height="80px" />
        <Text>Thank you for using the Tally tool.</Text>
        <Spacer height="24px" />
        <Text>For help or to find more information about us, please visit our website.</Text>
        <Spacer height="48px" />
        <Anchor href="https://withtally.com">HTTPS://WITHTALLY.COM/</Anchor>
      </Content>
    </ScreenContainer>
  );
};

const Anchor = styled.a`
  font-family: Montserrat;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 29px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0.25px;

  color: #725bff;
  text-decoration: none;
`;

const Text = styled.p`
  font-family: Montserrat;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 29px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0.25px;
  margin: 0;

  color: #000000;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ScreenContainer = styled.div`
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

const Logo = styled(TallyLogo)`
  width: 400px;
  height: 148px;
`;

export default Options;
