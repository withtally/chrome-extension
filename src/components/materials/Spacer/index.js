import React from "react";
import styled from "styled-components";

const Spacer = ({ width, height}) => {
  return(
    <div>
      <StyledSpacer w={width} h={height} />
    </div>
  )
}

Spacer.defaultProps = {
  width: 0,
  height: 0
}

const StyledSpacer = styled.div`
  width: ${props => props.w};
  height: ${props => props.h};
`

export default Spacer