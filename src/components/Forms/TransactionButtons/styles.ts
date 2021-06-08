import {RectButton} from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import {Feather} from '@expo/vector-icons';
import styled, {css} from 'styled-components/native';

interface ContainerProps {
    isActive: boolean;
    type: string;
}

interface IconsProps {
    type: 'up' | 'down';
}

export const Container = styled.View<ContainerProps>`
width: 48%;

border-width: ${({isActive})=> isActive ? 0 : 1.5}px;
border-style: solid;     
border-color: ${({theme})=> theme.colors.text};
border-radius: 5px;

${({isActive, type})=> isActive && type === 'down' && css`
background-color: ${({theme})=>theme.colors.attention_light};
`}

${({isActive, type})=> isActive && type === 'up' && css`
background-color: ${({theme})=>theme.colors.success_light};
`}

`;

export const Button = styled(RectButton)`
flex-direction: row;
justify-content: center;
align-items: center;
padding: 16px;
`;

export const Icon = styled(Feather)<IconsProps>`
font-size:  ${RFValue(24)}px;
margin-right: 12px;
color: ${({ type, theme})=> type === 'down' ?
 (theme.colors.attention) : 
 (theme.colors.success)
}
`;

export const Title = styled.Text`
font-family: ${({theme})=>theme.fonts.regular};
font-size: ${RFValue(14)}px;
color: ${({theme})=>theme.colors.text_dark};
`;