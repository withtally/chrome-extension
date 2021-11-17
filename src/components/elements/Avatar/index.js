import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Avatar  = ({url}) => {
  return(
    <Image src={url} alt="Avatar" />
  )
}

const Image = styled.img`
  width: 124px;
  height: 124px;
  border-radius: 124px;
`

export default Avatar;