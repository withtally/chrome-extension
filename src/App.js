import logo from './logo.svg';
import './App.css';
import { ReactComponent as TallyLogo } from './assets/logo.svg';
import styled from 'styled-components';
import Spacer from './components/materials/Spacer';
import { MdHelp } from 'react-icons/md';

function App() {
  return (
    <PopupContainer className="App">
      <Top>
        <Logo />
        <OptionsContainer>
            <OptionsButton onClick={() => {
              // eslint-disable-next-line no-undef
              chrome.runtime.openOptionsPage(() => {})
            }} />
        </OptionsContainer>
      </Top>
      <Spacer height="8px" />
      <Text>To use the Tally tool, <b>highlight and right click</b> or <b>hover</b> over an Ethereum Address.</Text>
    </PopupContainer>
  );
}

const OptionsButton = styled(MdHelp)`
  color: #AEAEAE;
  width: 24px;
  height: 24px;
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.primary};
  }
`

const OptionsContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
`

const Top = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: relative;
  align-self: stretch;
`;

const Text = styled.p`
  font-family: Montserrat;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 150%;
  /* or 21px */
  text-align: center;
  letter-spacing: 0.25px;

  color: #000000;
`

const PopupContainer = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
`

const Logo = styled(TallyLogo)`
  width: 100px;
  height: 37px;
`

export default App;
