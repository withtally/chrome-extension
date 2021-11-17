import styled from 'styled-components';

export const Button = styled.button`
  background-color: ${props => props.theme.grey100};
  padding: 0;
  border: none;
  border-radius: 8px; 
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background-color: ${props => props.theme.primary};
    color: white;
  }
`

Button.defaultProps = {
  theme: {
    primary: "blue",
    grey200: "light-grey",
  }
}
