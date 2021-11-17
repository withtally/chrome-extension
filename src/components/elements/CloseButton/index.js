import React, { useState, useEffect } from 'react';
import { Button } from './styles';
import { MdClose } from 'react-icons/md'

const CloseButton = ({onClick, ...rest}) => {
  return(
    <Button onClick={onClick} {...rest}>
      <MdClose />
    </Button>
  )
}

export default CloseButton;