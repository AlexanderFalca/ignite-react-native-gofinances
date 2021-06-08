import { RFValue } from 'react-native-responsive-fontsize';
import {TextInput} from 'react-native'
import styled, {css} from 'styled-components/native';

interface TransactionProps {
    type: 'positive' | 'negative';
}

export const Container = styled(TextInput)`
width: 100%;
padding: 16px 18px;
background-color: ${({theme})=>theme.colors.shape};
font-family: ${({theme})=>theme.fonts.regular};
font-size: ${RFValue(14)}px;
color: ${({theme})=>
theme.colors.text_dark};
border-radius: 5px;
margin-bottom: 8px;
`;
