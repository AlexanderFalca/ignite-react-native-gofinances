 import React, { useCallback, useState } from 'react';
 import {ActivityIndicator} from 'react-native'
 import AsyncStorage from '@react-native-async-storage/async-storage';
 import { useFocusEffect } from '@react-navigation/core';
 import { useTheme } from '@react-navigation/native';
import HighlightCard from '../../components/HighlightCard';
import TransactionCard, {TransactionCardProps} from '../../components/TransactionCard';
 import {
     UserWrapper, 
     Container, 
     Header,
     UserInfo,
     Photo,
     User,
     UserGreeting,
     UserName,
     Icon,
     HighlightCards,
     Transactions, 
     Title,
     TransactionsList,
     LogoutButton, LoadingContainer
     } from './styles'

     export interface TransactionsListData extends TransactionCardProps {
         id: string,
     } 

   interface HighLightProps {   
    amount: string;
    lastTransaction: string;
   }
   
     interface HighLightData {
         incomes : HighLightProps;
         expenses: HighLightProps;
         total: HighLightProps;

   }

 export function Dashboard () {
    const theme = useTheme()
  /*   const data: TransactionsListData[] = [
        {
            id: '1',
            type: 'positive',
        title: 'Web development',  
            amount: '$ 12.000,00', 
            category: {
                name: 'Sales',
                icon: 'shopping-bag',},
                date: '10/04/2020'
    },
    {
        id: '2',
        type: 'negative',
        title: 'Hamburgueria Pizzy',  
            amount: '$ 59,00', 
            category: {
                name: 'Meals',
                icon: 'coffee',},
                date: '13/04/2020'
    },
    {
        id: '3',
        type: 'positive',
        title: 'Rent',  
            amount: '$ 1.200,00', 
            category: {
                name: 'House',
                icon: 'dollar-sign',},
                date: '11/04/2020'
    }
 ]; */

 const [isLoading, setIsLoading] = useState(true);
 const [transactions, setTransactions] = useState<TransactionsListData[]>();
 const [highLightData, setHighLightData] = useState<HighLightData>({} as HighLightData);

 function getLastTransactionDate(
     collection: TransactionsListData[],
     type: 'positive' | 'negative'
 ){
     const lastTransaction = new Date(
     Math.max.apply(Math, collection
        .filter(transaction => transaction.type === type)
        .map(transaction => new Date(transaction.date).getTime())))
     
     return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' })}`;
 }

 async function loadTransactions() {
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let incomes = 0;
    let expenses = 0;

    const transactionsFormatted: TransactionsListData[] = transactions
    .map((item: TransactionsListData)=>{

        if(item.type === 'positive'){
            incomes += Number(item.amount);
        } else {
            expenses += Number(item.amount);
        }
      
        const amount = Number(item.amount).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        const date = Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year:'2-digit'
        }).format(new Date(item.date));

         return {
             id: item.id,
             name: item.name,
             amount,
             type: item.type,
             category: item.category,
             date
         }
    })

    setTransactions(
        // transactions
         transactionsFormatted
         );
 
    const lastTransactionIncomes = getLastTransactionDate(transactions, 'positive');
    const lastTransactionExpenses = getLastTransactionDate(transactions, 'negative');
    const totalInterval = `01 à ${lastTransactionExpenses}`;

    let total = incomes - expenses;

    setHighLightData({
        incomes: {
            amount: Number(incomes).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
        }),
        lastTransaction: `Last income day: ${lastTransactionIncomes}`,
        },
        expenses: {
            amount: Number(expenses).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }),
            lastTransaction: `Last debt day: ${lastTransactionExpenses}`,
        },
        total: {
            amount: Number(total).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }),
            lastTransaction: totalInterval,
        } 
    })
        setIsLoading(false)
}

    useFocusEffect(useCallback(()=>{
    loadTransactions()
},[]));


    return (
        <Container >
       { isLoading ? <LoadingContainer>

           <ActivityIndicator 
           color={theme.colors.primary}
           size="large"
             />  
       </LoadingContainer> :
       <> 
       <Header>
                <UserWrapper>
            <UserInfo>

                <Photo source={{uri: "https://avatars0.githubusercontent.com/u/8227089?v=4.png "}} />
                <User>
                <UserGreeting>Hi, there!</UserGreeting>
                <UserName>Alexander Falca</UserName>
                </User>
            </UserInfo>
            <LogoutButton onPress={()=>{}} >
            <Icon name="power"  />
            </LogoutButton>
                </UserWrapper>
        </Header>
        <HighlightCards>
        <HighlightCard type={'up'} 
        title='Income' 
        amount={highLightData.incomes.amount} 
        lastTransaction={highLightData.incomes.lastTransaction} />
        <HighlightCard type={'down'} 
        title='Debt' 
        amount={highLightData.expenses.amount} 
        lastTransaction={highLightData.expenses.lastTransaction} />
        <HighlightCard type={'total'} 
        title='Total' 
        amount={highLightData.total .amount} 
        lastTransaction={highLightData.total.lastTransaction} />
        </HighlightCards>

        <Transactions>
            <Title>List</Title>
        <TransactionsList 
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={({item}) => <TransactionCard data={item}/>}
        />
        
        </Transactions>
        </>
        }
    </Container>
    );
 }