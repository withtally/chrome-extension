// If your extension doesn't need a content script, just leave this file empty

// This is an example of a script that will run on every page. This can alter pages
// Don't forget to change `matches` in manifest.json if you want to only change specific webpages
/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx, } from '@emotion/react'
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import Frame, {FrameContextConsumer} from 'react-frame-component';
// import tippy, {followCursor} from 'tippy.js';
import { v4 as uuidv4 } from 'uuid';
import emotionNormalize from 'emotion-normalize';
import emotionReset from 'emotion-reset';

import { ReactComponent as TallyLogo } from '../assets/logo.svg';
import tippy, {followCursor} from 'tippy.js/headless';
import {MdChevronRight} from 'react-icons/md';
import {StyleSheetManager, ThemeProvider} from 'styled-components';
import styled from 'styled-components';
import CloseButton from '../components/elements/CloseButton';
import theme from "../theme/index"
import { createGlobalStyle } from 'styled-components'
import Avatar from '../components/elements/Avatar';
import Subtitle from '../components/text/Subtitle';
import Spacer from '../components/materials/Spacer';
import Title from '../components/text/Title';
import CircleImageLink from '../components/elements/CircleImageLink';
import axios from 'axios';
import ProfilePicturePlaceholder from '../assets/ProfilePicturePlaceholder.png';
import Button from '../components/elements/Button';

const Main = () => {
  const node = useRef();
  const [address, setAddress] = useState(null);
  const [open, setOpen] = useState(false);
  const [poaps, setPoaps] = useState(null);
  const [nfts, setNfts] = useState(null);
  const [tallyIdentity, setTallyIdentity] = useState(null);
  const [isValidAddress, setIsValidAddress] = useState(null);

  // Open Tally Popup via context menu mesage from background.js
  useEffect(() => {
    // eslint-disable-next-line no-undef
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      setTimeout(function() {
        sendResponse({status: true});
      }, 1);
      setAddress(message);
      return true
    });
  }, []);

  // Open Tally Popup when address changes
  useEffect(() => {
    if(address){
      setOpen(true)
    }
  }, [address])

  // Make sure address is valid
  useEffect(() => {
    if(address){
      const matches = /0x[a-fA-F0-9]{40}$/.test(address)
      setIsValidAddress(matches);
    }
  }, [address])

  // When Tally Popup closes, reset values
  useEffect(() => {
    if(!open){
      setAddress(null);
      setPoaps(null);
      setNfts(null);
      setTallyIdentity(null);
      setIsValidAddress(null);
    }
  }, [open])

  // Get NFTs
  useEffect(() => {
    if(address && isValidAddress){
      axios.get(`https://api.opensea.io/api/v1/assets?owner=${address.toLowerCase()}&order_direction=desc&offset=0&limit=50`)
        .then(res => {
          setNfts(res.data.assets)
        })
    }
  }, [address, isValidAddress])

  // Get Tally Identity
  useEffect(() => {
    if(address && isValidAddress){
      axios
        .get(`https://identity.withtally.com/user/profiles/by/address?addresses[]=${address.toLowerCase()}`)
        .then(res => {
          let identity = res.data?.data?.usersByAddress[address.toLowerCase()];
          if(identity){
            setTallyIdentity(identity);
          }
        })
    }
  }, [address, isValidAddress])

  // Get POAPs
  useEffect(() => {
    if(address && isValidAddress){
      axios
        .get(`https://api.poap.xyz/actions/scan/${address.toLowerCase()}`)
        .then(res => {
          setPoaps(res.data)
        })
    }
  }, [address, isValidAddress])

  // Handles Tally Popup close
  const handleClickOutside = e => {
    console.log("clicking anywhere");
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
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);


  const walkElement = (root) => {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    var element = walker.nextNode();
    while (element) {
      const currentEl = element;
      element = walker.nextNode();
      const matches = /0x[a-fA-F0-9]{40}($|\s)/.test(currentEl.textContent);
      // console.log(matches, currentEl.textContent)
      if(matches){
        const alreadyTagged = currentEl.parentElement.classList.contains("bugga");
        if(!alreadyTagged){
          var wrapper = document.createElement("span");
          // element.parentNode.insertBefore(wrapper, element);
          // wrapper.appendChild(element);
          
          wrapper.innerHTML = currentEl.textContent.replaceAll(/0x[a-fA-F0-9]{40}($|\s)/g, `<span class="bugga">$&</span>`);

          currentEl.replaceWith(wrapper);
          wrapper.querySelectorAll('.bugga').forEach(el => {
            const id = uuidv4();
            el.id = "t-" + id;
            const openButton = document.createElement('button');
            openButton.innerHTML = "Click Me";
            openButton.onclick = (e) => {
              e.preventDefault();
              setAddress(el.innerText)
            }
            // let tooltipRoot = document.createElement('div');
            // tooltipRoot.style.padding = "0 important!";
            // tooltipRoot.style.margin = "0 important!";

            // const element = (
            //   <div css={css`
            //     ${emotionNormalize}
            //     display: flex;
            //     padding: 8px !important;
                
            //   `}>
            //     <TallyLogo width="40" css={css`
            //       background: red;
            //     `} />
            //   </div>
            // );

            // ReactDOM.render(element, tooltipRoot);

            // tippy(`#t-${id}`, {
              
            //   content: tooltipRoot,
            //   interactive: true,
            //   popperOptions: {
            //     strategy: 'fixed',
            //   },
            //   followCursor: false,
            //   plugins: [followCursor],
            //   appendTo: () => document.body,
            //   theme: 'light'
            // });

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
                    <div
                      css={css`
                        ${emotionNormalize}
                      `}
                    >
                    <div 
                      onClick={(e) => {
                        e.preventDefault();
                        setAddress(el.innerText)
                      }}
                      css={css`   
                        display: block;                  
                        background-color: #EEEEEE;
                        box-shadow: 1px 4px 15px 0px rgba(0,0,0,0.16);
                        border-radius: 4px;
                        cursor: ${hovered ? 'pointer' : 'auto'}
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
                      `}
                      onMouseEnter={() => {
                        setHovered(true)
                      }}
                      onMouseLeave={() => {
                        setHovered(false)
                      }}
                    >
                    <div css={css`

                    `}>

                    <div css={css`
                      padding: 4px;
                      display: flex;
                      flex-direction: row;
                      align-items: center;
                    `}>
                      <div css={css`
                        margin-left: 4px;
                        margin-right: 4px;
                      `}>
                        <TallyLogo css={css`
                          width: 42px;
                          height: 24px;
                        `} />
                      </div>
                      <div css={css`width: 8px`} />
                      <RightArrowIndicator hovered={hovered}/>
                    </div>
                    </div>
                  </div>
                    </div>
                  )
                }
  
                ReactDOM.render(<Popper />, popperRoot);

                // const box = document.createElement('div');
            
                // popper.appendChild(box);
            
                // box.className = 'my-custom-class';
                // box.textContent = instance.props.content;
            
                function onUpdate(prevProps, nextProps) {
                  // DOM diffing
                  // if (prevProps.content !== nextProps.content) {
                  //   box.textContent = nextProps.content;
                  // }
                }
            
                // Return an object with two properties:
                // - `popper` (the root popper element)
                // - `onUpdate` callback whenever .setProps() or .setContent() is called
                return {
                  popper: popperRoot,
                };
              },
              appendTo: () => document.body,
            });
          })

        }
      } else {
        element = walker.nextNode();
      }
    }
  }

  useEffect(() => {
    // Unique ID for the className.
    var MOUSE_VISITED_CLASSNAME = 'crx_mouse_visited';

    // Previous dom, that we want to track, so we can remove the previous styling.
    var prevDOM = null;

    // Mouse listener for any move event on the current document.
    document.addEventListener('mousemove', function (e) {
        let srcElement = e.srcElement;
        walkElement(srcElement);
        
    }, false);
  }, [])

  if(!open){
    return null
  }

  return (
    <div
      ref={node}
      css={css`
        position: fixed;
        top: 0;
        right: 0;
        height: 580px;
        width: 400px;
        z-index: 100000000000 !important;
      `}
    >
      <StyledFrame frameBorder="0" width="400px" height="580px" allowtransparency="true">
        <FrameContextConsumer>
          {
            frameContext => (
              <StyleSheetManager target={frameContext.document.head}>
                <ThemeProvider theme={theme}>
                  {/* <React.Fragment> */}
                  <GlobalStyle /> 
                    <Container>
                      <PopupContainer>
                        <Top>
                          <Logo />
                          <CloseButton onClick={() => setOpen(false)}/>
                        </Top>
                        {
                          isValidAddress === false &&
                          <Body>
                            <Spacer height="40px" />
                            <Title>Please select a valid address.</Title>
                          </Body>
                        }
                        {
                        isValidAddress &&
                        <Body>
                          {
                            tallyIdentity && tallyIdentity.avatarUrl !== "" ?
                            <Avatar url={tallyIdentity.avatarUrl}/>
                            :
                            <Avatar url={ProfilePicturePlaceholder} />
                          }
                          <Spacer height="20px" />
                          {
                            tallyIdentity &&
                            <Subtitle>{tallyIdentity.displayName}</Subtitle>
                          }
                          <Subtitle>{address.substr(0,8)}...{address.substr(-6)}</Subtitle>
                          <Spacer height="32px" />
                          {
                            tallyIdentity?.tallyId &&
                            <React.Fragment>
                              <Button as="a" href={`https://www.withtally.com/voter/profile/${tallyIdentity.tallyId}`} target="_blank" rel="noopener noreferrer">
                                <Button.Text>
                                  View Complete Profile On Tally
                                </Button.Text>
                              </Button>
                              <Spacer height="32px" />
                            </React.Fragment>
                          }
                          {
                            poaps &&
                            <GroupContainer>
                              <GroupContent>
                                <Title>POAPs</Title>
                                <Subtitle>Holding {poaps.length} POAPs</Subtitle>
                                <Spacer height="20px" />
                                <CircleImageGroup>
                                  {
                                    poaps.map(poap => (
                                      <CircleImageLink 
                                        key={`poap-${poap.tokenId}-${poap.event.name}`} 
                                        href={`https://app.poap.xyz/token/${poap.tokenId}`} 
                                        imageUrl={poap.event.image_url}
                                        name={poap.event.name}
                                      />
                                    ))
                                  }
                                  <Spacer height="0" width="72px" />
                                  <Spacer height="0" width="72px" />
                                  <Spacer height="0" width="72px" />
                                  <Spacer height="0" width="72px" />
                                  <Spacer height="0" width="72px" />
                                  <Spacer height="0" width="72px" />
                                  <Spacer height="0" width="72px" />
                                  <Spacer height="0" width="72px" />
                                </CircleImageGroup>   
                              </GroupContent>
                            </GroupContainer>
                          }
                          <Spacer height="20px" />
                          {
                            nfts &&
                            <GroupContainer>
                              <GroupContent>
                                <Title>NFTs</Title>
                                <Subtitle>Holding {nfts.length}{nfts.length === 50 ? '+' : ''} NFTs</Subtitle>
                                <Spacer height="20px" />
                                <CircleImageGroup>
                                  {
                                    nfts.map(nft => (
                                      <CircleImageLink 
                                        key={`nft-${nft.token_id}-${nft.name}`} 
                                        href={nft.permalink} 
                                        imageUrl={nft.image_thumbnail_url}
                                        name={nft.name}
                                      />
                                    ))
                                  }
                                  <Spacer height="0" width="72px" />
                                  <Spacer height="0" width="72px" />
                                  <Spacer height="0" width="72px" />
                                  <Spacer height="0" width="72px" />
                                  <Spacer height="0" width="72px" />
                                  <Spacer height="0" width="72px" />
                                  <Spacer height="0" width="72px" />
                                  <Spacer height="0" width="72px" />
                                </CircleImageGroup>   
                              </GroupContent>
                            </GroupContainer>
                          }
                        </Body>
                        }
                        
                        {/* <p>Clicked Id:</p>
                        <p>{address || "Nothing hovered"}</p> */}
                      </PopupContainer>
                    </Container>
                  {/* </React.Fragment> */}
                </ThemeProvider>
              </StyleSheetManager>
            )
          }
        </FrameContextConsumer>
      </StyledFrame>
    </div>
  )
}

const StyledFrame = styled(Frame)`

`

const GroupContainer = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-left: 20px;
  padding-right: 20px;
`

const GroupContent = styled.div`
  flex: 1;
  max-width: 336px;
  display: flex;
  flex-direction: column;
`

const CircleImageGroup = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`

const RightArrowIndicator = ({hovered}) => {
  return(
    <div css={css`
      width: 14px;
      height: 14px;
      display: flex;
      flex-direction: row;
      align-items: center !important;
      justify-content: center !important;
      background: ${hovered ? "#725BFF" : "white"};
      border-radius: 14px;
    `}>
      <MdChevronRight color={hovered ? "white" : "#725BFF"} css={css`
        margin: 0;
      `}/>
    </div>
  )
}

const PopupContainer = styled.div`
  background: white;
  box-shadow: 4px 4px 16px 0px rgba(0,0,0,0.16);
  display: flex;
  flex-direction: column;
  flex: 1;
  border-radius: 8px;
`

const Container = styled.div`
  flex: 1;
  padding: 20px;
  display: inline-flex;
  background: #FFFFFF00 !important;

`

const Top = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const Logo = styled(TallyLogo)`
  width: 100px;
  height: 37px;
`

const Body = styled.div`
  ::-webkit-scrollbar {display:none;}
  flex: 1;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const GlobalStyle = createGlobalStyle`
  body, html {
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
`



const app = document.createElement('div');
app.id = "my-extension-root";
document.body.appendChild(app);
ReactDOM.render(<Main />, app);
