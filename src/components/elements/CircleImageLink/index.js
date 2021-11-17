import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const CircleImageLink = ({href, imageUrl, name}) => {
  return(
    <Link href={href} target="_blank" rel="noopener noreferrer">
      <Image alt={name} title={name} src={imageUrl}/>
    </Link>
  )
}

const Link = styled.a`

`

const Image = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 72px;
  border: solid transparent 4px;
  transition: all 200ms;

  &:hover {
    border: solid #725BFF 4px;
  }
  
`

export default CircleImageLink;