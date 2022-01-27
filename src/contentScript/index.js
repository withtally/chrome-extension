import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import { v4 as uuidv4 } from 'uuid';
import { Normalize } from 'styled-normalize';
import { ReactComponent as TallyLogo } from '../assets/logo.svg';
import tippy, { followCursor } from 'tippy.js/headless';
import { MdChevronRight } from 'react-icons/md';
import { StyleSheetManager, ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import CloseButton from '../components/elements/CloseButton';
import theme from '../theme/index';
import { createGlobalStyle } from 'styled-components';
import Avatar from '../components/elements/Avatar';
import Subtitle from '../components/text/Subtitle';
import Spacer from '../components/materials/Spacer';
import Title from '../components/text/Title';
import CircleImageLink from '../components/elements/CircleImageLink';
import axios from 'axios';
import ProfilePicturePlaceholder from '../assets/ProfilePicturePlaceholder.png';
import Button from '../components/elements/Button';
import RecentTransaction from '../components/specialized/tallyPopup/RecentTransaction';
import TokenBalance from '../components/specialized/tallyPopup/TokenBalance';
import SeeMore from '../components/specialized/tallyPopup/SeeMore';
import { ethers } from 'ethers';

// eslint-disable-next-line no-undef
const montserratFont = chrome.runtime.getURL('fonts/Montserrat-Regular.ttf');
// eslint-disable-next-line no-undef
const montserratFontBold = chrome.runtime.getURL('fonts/Montserrat-Bold.ttf');
// eslint-disable-next-line no-undef
const montserratFontSemiBold = chrome.runtime.getURL('fonts/Montserrat-SemiBold.ttf');

const { REACT_APP_ETHERSCAN_KEY } = process.env;
const provider = new ethers.providers.CloudflareProvider();

const Main = () => {
  const node = useRef();
  const [address, setAddress] = useState(null);
  const [open, setOpen] = useState(false);
  const [poaps, setPoaps] = useState(null);
  const [nfts, setNfts] = useState(null);
  const [tallyIdentity, setTallyIdentity] = useState(null);
  const [isValidAddress, setIsValidAddress] = useState(null);
  const [input, setInput] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState(null);
  const [balanceData, setBalanceData] = useState(null);
  const [ensName, setEnsName] = useState(null);

  useEffect(() => {
    if (address && isValidAddress) {
      // eslint-disable-next-line no-undef
      chrome.runtime.sendMessage({
        type: 'bitquery-address',
        address,
      });
    }
  }, [address, isValidAddress]);

  useEffect(() => {
    // Open Tally Popup via context menu mesage from background.js
    // eslint-disable-next-line no-undef
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'selection-text') {
        setInput(message.payload);
        sendResponse();
        return true;
      }
    });

    // Get response from bitquery
    // eslint-disable-next-line no-undef
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'bitquery-response') {
        if (address === message.payload.address) {
          setBalanceData(message.payload.data);
        }
        sendResponse();
        return true;
      }
    });
  }, [address]);

  // Open Tally Popup when input changes
  useEffect(() => {
    if (input) {
      setOpen(true);
    }
  }, [input]);

  const handleInput = useCallback(async (input) => {
    if (input) {
      const matchesAddress = /0x[a-fA-F0-9]{40}/.test(input);
      if (matchesAddress) {
        setIsValidAddress(true);
        setAddress(input);
      } else {
        const matchesEnsName = /\S+\.eth/.test(input);
        if (matchesEnsName) {
          const resolvedAddress = await provider.resolveName(input);
          if (resolvedAddress) {
            setEnsName(input);
            setAddress(resolvedAddress);
          } else {
            setIsValidAddress(false);
          }
        } else {
          setIsValidAddress(false);
        }
      }
    }
  }, []);

  // If an address is set, make sure it is valid
  useEffect(() => {
    if (address) {
      const matchesAddress = /0x[a-fA-F0-9]{40}/.test(address);
      if (matchesAddress) {
        setIsValidAddress(true);
      }
    }
  }, [address]);

  // Handle new text input
  useEffect(() => {
    handleInput(input);
  }, [handleInput, input]);

  // When Tally Popup closes, reset values
  useEffect(() => {
    if (!open) {
      setAddress(null);
      setPoaps(null);
      setNfts(null);
      setTallyIdentity(null);
      setIsValidAddress(null);
      setBalanceData(null);
      setInput(null);
      setEnsName(null);
    }
  }, [open]);

  // Get NFTs
  useEffect(() => {
    if (address && isValidAddress) {
      axios
        .get(
          `https://api.opensea.io/api/v1/assets?owner=${address.toLowerCase()}&order_direction=desc&offset=0&limit=50`
        )
        .then((res) => {
          setNfts(res.data.assets);
        });
    }
  }, [address, isValidAddress]);

  // Get Tally Identity
  useEffect(() => {
    if (address && isValidAddress) {
      axios
        .get(
          `https://identity.withtally.com/user/profiles/by/address?addresses[]=${address.toLowerCase()}`
        )
        .then((res) => {
          let identity = res.data?.data?.usersByAddress[address.toLowerCase()];
          if (identity) {
            setTallyIdentity(identity);
          }
        });
    }
  }, [address, isValidAddress]);

  // Get POAPs
  useEffect(() => {
    if (address && isValidAddress) {
      axios.get(`https://api.poap.xyz/actions/scan/${address.toLowerCase()}`).then((res) => {
        setPoaps(res.data);
      });
    }
  }, [address, isValidAddress]);

  // Get Recent Transactions
  useEffect(() => {
    if (address && isValidAddress) {
      axios
        .get(
          `https://api.etherscan.io/api?module=account&action=txlist&address=${address.toLowerCase()}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${REACT_APP_ETHERSCAN_KEY}`
        )
        .then((res) => {
          setRecentTransactions(res.data.result);
        });
    }
  }, [address, isValidAddress]);

  // Handles Tally Popup close
  const handleClickOutside = (e) => {
    if (node.current.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    setOpen(false);
  };

  // Close Tally Popup when click outside
  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const walkElement = (root) => {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    var element = walker.nextNode();
    while (element) {
      const currentEl = element;
      element = walker.nextNode();
      const matchesAddress = /0x[a-fA-F0-9]{40}($|\s)/.test(currentEl.textContent);
      const matchesEnsName = /\S+\.eth/.test(currentEl.textContent);
      // console.log(matches, currentEl.textContent);
      if (matchesAddress || matchesEnsName) {
        const alreadyTagged = currentEl.parentElement.classList.contains('tally-wrapper');
        if (!alreadyTagged) {
          var wrapper = document.createElement('span');

          if (matchesAddress) {
            wrapper.innerHTML = currentEl.textContent.replaceAll(
              /0x[a-fA-F0-9]{40}($|\s)/g,
              `<span class="tally-wrapper">$&</span>`
            );
          } else if (matchesEnsName) {
            wrapper.innerHTML = currentEl.textContent.replaceAll(
              /\S+\.eth/g,
              `<span class="tally-wrapper">$&</span>`
            );
          }

          currentEl.replaceWith(wrapper);
          wrapper.querySelectorAll('.tally-wrapper').forEach((el) => {
            const id = uuidv4();
            el.id = 't-' + id;

            tippy(`#t-${id}`, {
              animation: true,
              interactive: true,
              plugins: [followCursor],
              followCursor: false,
              onHide(instance) {
                // perform your hide animation in here, then once it completes, call
                // instance.unmount()

                // Example: unmounting must be async (like a real animation)
                requestAnimationFrame(instance.unmount);
              },
              render(instance) {
                // The recommended structure is to use the popper as an outer wrapper
                // element, with an inner `box` element
                let popperRoot = document.createElement('div');

                const Popper = () => {
                  const [hovered, setHovered] = useState(false);
                  return (
                    <div>
                      <Normalize />
                      <TooltipContainer
                        hovered={hovered}
                        onClick={(e) => {
                          e.preventDefault();
                          setInput(el.innerText.replace(/[\u200B-\u200D\uFEFF]/g, ''));
                        }}
                        onMouseEnter={() => {
                          setHovered(true);
                        }}
                        onMouseLeave={() => {
                          setHovered(false);
                        }}
                      >
                        <TooltipRow>
                          <TooltipLogoContainer>
                            <StyledTallyLogo />
                          </TooltipLogoContainer>
                          <Spacer width="8px" />
                          <RightArrowIndicator hovered={hovered} />
                        </TooltipRow>
                      </TooltipContainer>
                    </div>
                  );
                };

                ReactDOM.render(<Popper />, popperRoot);

                // function onUpdate(prevProps, nextProps) {
                //   // DOM diffing
                //   // if (prevProps.content !== nextProps.content) {
                //   //   box.textContent = nextProps.content;
                //   // }
                // }

                // Return an object with two properties:
                // - `popper` (the root popper element)
                // - `onUpdate` callback whenever .setProps() or .setContent() is called
                return {
                  popper: popperRoot,
                };
              },
              appendTo: () => document.body,
            });
          });
        }
      } else {
        element = walker.nextNode();
      }
    }
  };

  useEffect(() => {
    document.addEventListener(
      'mousemove',
      function (e) {
        let srcElement = e.srcElement;
        walkElement(srcElement);
      },
      false
    );
  }, []);

  if (!open) {
    return null;
  }

  return (
    <Modal ref={node}>
      <StyledFrame frameBorder="0" width="420px" height="600px" allowtransparency="true">
        <FrameContextConsumer>
          {(frameContext) => (
            <StyleSheetManager target={frameContext.document.head}>
              <ThemeProvider theme={theme}>
                <GlobalStyle />
                <Container>
                  <PopupContainer>
                    <Top>
                      <Logo />
                      <CloseButton onClick={() => setOpen(false)} />
                    </Top>
                    {isValidAddress === false && (
                      <Body>
                        <Spacer height="40px" />
                        <Title>Please select a valid address.</Title>
                        <Subtitle>Selected: {input}</Subtitle>
                      </Body>
                    )}
                    {isValidAddress && (
                      <Body>
                        {tallyIdentity &&
                        tallyIdentity.avatarUrl !== '' &&
                        tallyIdentity.avatarUrl !== null ? (
                          <Avatar url={tallyIdentity.avatarUrl} />
                        ) : (
                          <Avatar url={ProfilePicturePlaceholder} />
                        )}
                        <Spacer height="20px" />
                        {tallyIdentity && <Subtitle>{tallyIdentity.displayName}</Subtitle>}
                        {ensName && ensName !== tallyIdentity?.displayName && (
                          <Subtitle>{ensName}</Subtitle>
                        )}
                        <Subtitle>
                          {address.substr(0, 8)}...{address.substr(-6)}
                        </Subtitle>
                        <Spacer height="32px" />
                        {tallyIdentity?.tallyId && (
                          <React.Fragment>
                            <Button
                              as="a"
                              href={`https://www.withtally.com/voter/profile/${tallyIdentity.tallyId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button.Text>View Complete Profile On Tally</Button.Text>
                            </Button>
                            <Spacer height="32px" />
                          </React.Fragment>
                        )}
                        {poaps && (
                          <GroupContainer>
                            <GroupContent>
                              <Title>POAPs</Title>
                              <Subtitle>Holding {poaps.length} POAPs</Subtitle>
                              <Spacer height="20px" />
                              <CircleImageGroup>
                                {poaps.map((poap) => (
                                  <CircleImageLink
                                    key={`poap-${poap.tokenId}-${poap.event.name}-${address}`}
                                    href={`https://app.poap.xyz/token/${poap.tokenId}`}
                                    imageUrl={poap.event.image_url}
                                    name={poap.event.name}
                                  />
                                ))}
                                <Spacer height="0" width="72px" />
                                <Spacer height="0" width="72px" />
                                <Spacer height="0" width="72px" />
                                <Spacer height="0" width="72px" />
                                <Spacer height="0" width="72px" />
                                <Spacer height="0" width="72px" />
                                <Spacer height="0" width="72px" />
                                <Spacer height="0" width="72px" />
                              </CircleImageGroup>
                              <SeeMore url={`https://app.poap.xyz/scan/${address}`} />
                            </GroupContent>
                          </GroupContainer>
                        )}
                        <Spacer height="20px" />
                        {nfts && (
                          <GroupContainer>
                            <GroupContent>
                              <Title>NFTs</Title>
                              <Subtitle>
                                Holding {nfts.length}
                                {nfts.length === 50 ? '+' : ''} NFTs
                              </Subtitle>
                              <Spacer height="20px" />
                              <CircleImageGroup>
                                {nfts.map((nft) => (
                                  <CircleImageLink
                                    key={`nft-${nft.token_id}-${nft.name}-${address}`}
                                    href={nft.permalink}
                                    imageUrl={nft.image_thumbnail_url}
                                    name={nft.name}
                                  />
                                ))}
                                <Spacer height="0" width="72px" />
                                <Spacer height="0" width="72px" />
                                <Spacer height="0" width="72px" />
                                <Spacer height="0" width="72px" />
                                <Spacer height="0" width="72px" />
                                <Spacer height="0" width="72px" />
                                <Spacer height="0" width="72px" />
                                <Spacer height="0" width="72px" />
                              </CircleImageGroup>
                              <SeeMore url={`https://opensea.io/${address}`} />
                            </GroupContent>
                          </GroupContainer>
                        )}
                        <Spacer height="8px" />
                        {recentTransactions && (
                          <GroupContainer>
                            <GroupContent>
                              <Title>Recent Transactions</Title>
                              <Spacer height="20px" />
                              {recentTransactions.map((recentTransaction) => (
                                <React.Fragment
                                  key={`recentTransaction-${recentTransaction.hash}-${address}`}
                                >
                                  <RecentTransaction
                                    href={`https://etherscan.io/tx/${recentTransaction.hash}`}
                                    direction={
                                      recentTransaction.to === address.toLowerCase() ? 'IN' : 'OUT'
                                    }
                                    timestamp={recentTransaction.timeStamp}
                                    value={recentTransaction.value}
                                  />
                                  <Spacer height="8px" />
                                </React.Fragment>
                              ))}
                              <SeeMore url={`https://etherscan.io/address/${address}`} />
                            </GroupContent>
                          </GroupContainer>
                        )}
                        <Spacer height="8px" />
                        {balanceData && balanceData?.ethereum?.address[0]?.balances?.length > 0 && (
                          <GroupContainer>
                            <GroupContent>
                              <Title>ERC20 Tokens</Title>
                              <Spacer height="20px" />
                              <TokenGroup>
                                {balanceData.ethereum.address[0].balances
                                  .filter(
                                    (item, index, self) =>
                                      index ===
                                      self.findIndex((i) => i.currency.name === item.currency.name)
                                  )
                                  .map((token) => (
                                    <TokenContainer key={`token-${token.currency.name}-${address}`}>
                                      <TokenBalance
                                        name={token.currency.name}
                                        symbol={token.currency.symbol}
                                        balance={token.value}
                                      />
                                    </TokenContainer>
                                  ))}
                              </TokenGroup>
                            </GroupContent>
                          </GroupContainer>
                        )}
                        <Spacer height="40px" />
                      </Body>
                    )}
                  </PopupContainer>
                </Container>
              </ThemeProvider>
            </StyleSheetManager>
          )}
        </FrameContextConsumer>
      </StyledFrame>
    </Modal>
  );
};

const TokenGroup = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-column-gap: 8px;
  grid-row-gap: 8px;
`;

const TokenContainer = styled.div`
  width: 100%;
`;

const StyledFrame = styled(Frame)``;

const GroupContainer = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-left: 20px;
  padding-right: 20px;
`;

const GroupContent = styled.div`
  flex: 1;
  max-width: 336px;
  display: flex;
  flex-direction: column;
`;

const CircleImageGroup = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const RightArrowIndicator = ({ hovered }) => {
  return (
    <RightArrowIndicatorContainer hovered={hovered}>
      <StyledMdChevronRight color={hovered ? 'white' : '#725BFF'} />
    </RightArrowIndicatorContainer>
  );
};

const RightArrowIndicatorContainer = styled.div`
  width: 14px;
  height: 14px;
  display: flex;
  flex-direction: row;
  align-items: center !important;
  justify-content: center !important;
  background: ${(props) => (props.hovered ? '#725BFF' : 'white')};
  border-radius: 14px;
`;

const StyledMdChevronRight = styled(MdChevronRight)`
  margin: 0;
`;

const PopupContainer = styled.div`
  background: white;
  box-shadow: 4px 4px 16px 0px rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: column;
  flex: 1;
  border-radius: 8px;
`;

const Container = styled.div`
  flex: 1;
  padding: 20px;
  display: inline-flex;
  background: #ffffff00 !important;
`;

const Top = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Logo = styled(TallyLogo)`
  width: 100px;
  height: 37px;
`;

const Body = styled.div`
  ::-webkit-scrollbar {
    display: none;
  }
  flex: 1;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Montserrat';
    src: local('Montserrat'),
      url(${montserratFont}) format('truetype');
    font-weight: normal;
  }

  @font-face {
    font-family: 'Montserrat';
    src: local('Montserrat'),
      url(${montserratFontSemiBold}) format('truetype');
    font-weight: 600;
  }

  @font-face {
    font-family: 'Montserrat';
    src: local('Montserrat'),
      url(${montserratFontBold}) format('truetype');
    font-weight: bold;
  }

  body, html {
    font-family: 'Montserrat';
    height: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    background: #FFFFFF00;
  }
  .frame-root {
    display: flex;
    flex: 1;
    max-height: 100%;
    background: #FFFFFF00;
  }
  .frame-content {
    flex: 1;
    max-height: 100%;
    display: flex;
    background: #FFFFFF00;
  }
  iframe {
    background-color: transparent;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  height: 600px;
  width: 420px;
  z-index: 100000000000 !important;
`;

const TooltipContainer = styled.div`
  display: block;                  
  background-color: #EEEEEE;
  box-shadow: 1px 4px 15px 0px rgba(0,0,0,0.16);
  border-radius: 4px;
  cursor: ${(props) => (props.hovered ? 'pointer' : 'auto')}
  border-bottom: 5px solid #EEEEEE;
  &::after {
    content:'';
    position: absolute;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 0;
    height: 0;
    border-top: 5px solid #EEEEEE;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
  }
`;

const TooltipRow = styled.div`
  padding: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const TooltipLogoContainer = styled.div`
  margin-left: 4px;
  margin-right: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledTallyLogo = styled(TallyLogo)`
  width: 42px;
  height: 24px;
  margin: 0;
`;

const app = document.createElement('div');
app.id = 'my-extension-root';
document.body.appendChild(app);
ReactDOM.render(<Main />, app);
