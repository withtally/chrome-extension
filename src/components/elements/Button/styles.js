import styled from 'styled-components';

export const Button = styled.button`
  text-decoration: none;
  background-color: ${(props) => props.theme.primary};
  padding: 20px;
  border: none;

  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

export const ButtonText = styled.span`
  font-family: Montserrat;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  /* identical to box height */

  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0.25px;

  color: #ffffff;
`;

Button.defaultProps = {
  theme: {
    primary: 'blue',
    grey200: 'light-grey',
  },
};
