/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';

const Avatar = function ({ url }) {
  return <Image src={url} alt="Avatar" />;
};

const Image = styled.img`
  width: 124px;
  height: 124px;
  border-radius: 124px;
`;

export default Avatar;
