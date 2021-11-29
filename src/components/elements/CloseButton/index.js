/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from 'react';
import { MdClose } from 'react-icons/md';
import { Button } from './styles';

const CloseButton = function ({ onClick, ...rest }) {
  return (
    <Button onClick={onClick} {...rest}>
      <MdClose />
    </Button>
  );
};

export default CloseButton;
