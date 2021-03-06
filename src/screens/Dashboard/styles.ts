import {BorderlessButton} from 'react-native-gesture-handler';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { FlatList } from 'react-native';
import {Feather} from '@expo/vector-icons';
import styled from 'styled-components/native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import {TransactionsListData} from '.';

export const LoadingContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

export const Container = styled.View`
    flex: 1;
    background-color: ${(props)=>props.theme.colors.background};
`;

export const Header = styled.View`
width: 100%;
height: ${RFPercentage(42)}px;
background-color: ${({theme})=>theme.colors.primary};

justify-content: center;
align-items: center;
flex-direction: row;
margin-bottom: 50px;
`
export const UserWrapper = styled.View`
width: 100%;
margin-bottom: 130px;
padding: 0 24px;

flex-direction: row;
justify-content: space-between;
align-items: center;

`;
export const UserInfo = styled.View`
flex-direction: row;
align-items: center;
`;
export const Photo = styled.Image`
width: ${RFValue(48)}px;
height:  ${RFValue(48)}px;
border-radius: 10px;
`;
export const User = styled.View`
margin-left: 18px;
`;
export const UserGreeting = styled.Text`
color: ${({theme})=>theme.colors.shape};
font-size:  ${RFValue(18)}px;
font-family:  ${({theme})=>theme.fonts.regular };
`;
export const UserName = styled.Text`
color: ${({theme})=>theme.colors.shape};
font-size:  ${RFValue(18)}px;
font-family:  ${({theme})=>theme.fonts.bold };
`;

export const LogoutButton = styled(BorderlessButton)``;

export const Icon = styled(Feather)`

color: ${({theme})=>theme.colors.secondary};
font-size:  ${RFValue(32)}px;
`;

export const HighlightCards = styled.ScrollView.attrs({
    horizontal: true,
    showsHorizontalScrollIndicator: false,
    contentContainerStyle: { paddingHorizontal: 24}
})`
width: 100%;
position: absolute;
margin-top: ${RFPercentage(18)}px;
`;

export const Title = styled.Text`
font-size:  ${RFValue(18)}px;
margin-bottom: 16px;
font-family:  ${({theme})=>theme.fonts.bold };
color: ${({theme})=>theme.colors.text_dark};
`;
export const Transactions = styled.View`
flex: 1;
padding: 0 24px;
margin-top: ${RFPercentage(4)}px;
`;

export const TransactionsList = styled(
    FlatList as new () => FlatList<TransactionsListData>
    ).attrs({

    showsVerticalScrollIndicator: false,
    contentContainerStyle: {
        paddingBottom: getBottomSpace()
    }
})``;
