import React, { useCallback, useState } from 'react';
import {ActivityIndicator} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {addMonths, subMonths, format} from 'date-fns'
import {ptBR} from 'date-fns/locale';
import {VictoryPie} from 'victory-native';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import { categories } from '../../../utils/categories';
import { HistoryCard } from '../../components/HistoryCard';
import {
    Container, 
    Header, 
    Title, 
    Content, 
    ChartContent,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Month,
    LoadingContainer
} from './styles'
import { RFValue } from 'react-native-responsive-fontsize';

interface TransactionData {
    type: 'positive' | 'negative';
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface CategoryData {
    key: string;
    name: string;
    total: number;
    formattedTotal: string;
    color: string;
    formattedPercent: string;
    percent: number;
}

export function Resume ( ){
    const [isLoading, setIsLoading] = useState(false);
    const [dateSelected, setDateSelected] = useState(new Date());
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

    const theme = useTheme();

    function handleChangedDate(action: 'next' | 'prev'){

        if(action === 'next' ){
            setDateSelected(addMonths(dateSelected, 1));
        } else {
            setDateSelected(subMonths(dateSelected, 1));
        }
    }

    async function loadData() {
        setIsLoading(true);
        const dataKey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(dataKey);
        const responseData = response ? JSON.parse(response) : [];
        
        const expenses = responseData
        .filter((expense: TransactionData)=> 
        expense.type === 'negative' &&
        new Date(expense.date).getMonth() === dateSelected.getMonth() &&    
        new Date(expense.date).getFullYear() === dateSelected.getUTCFullYear()
        );

        const expensesTotal = expenses
        .reduce((accumulator: number, expense: TransactionData)=>{
            return accumulator + Number(expense.amount);
        },0);
        
        const totalByCategory: CategoryData[] = [];

        categories.forEach(category => {
            let categorySum = 0;

            expenses.forEach((expense: TransactionData) => {
                if(expense.category === category.key){
                    categorySum += Number(expense.amount)
                }
            });
            if(categorySum > 0){
                const formattedTotal = categorySum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })

                const percent = (categorySum / expensesTotal * 100);
                const formattedPercent = `${percent.toFixed(0)}%`; 

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    percent,
                    formattedPercent, 
                    total: categorySum,
                    formattedTotal,
                    color: category.color,
                })
            }
        });
        setTotalByCategories(totalByCategory)
        setIsLoading(false);
        
    }

    useFocusEffect(useCallback(()=>{
        loadData()
    },[dateSelected]));
    

  //  console.log(totalByCategories);

    return (
        <Container>
          
             <Header>
                 <Title>Resume by Category</Title>
             </Header>

       { isLoading ? <LoadingContainer>

        <ActivityIndicator    
        color={theme.colors.primary}
        size="large"  
        />  
        </LoadingContainer> :

        <Content
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: useBottomTabBarHeight(),
        }}
        >
            <MonthSelect>
                <MonthSelectButton onPress={()=> handleChangedDate('prev')} >
                    <MonthSelectIcon name="chevron-left" />
                </MonthSelectButton>

            <Month>{format(dateSelected, 'MMMM, yyyy', {locale: ptBR} )}</Month>

                <MonthSelectButton onPress={()=> handleChangedDate('next')} >
                    <MonthSelectIcon name="chevron-right" />
                </MonthSelectButton>
            </MonthSelect>

            
            <ChartContent>
            <VictoryPie 
            data={totalByCategories}
            colorScale={totalByCategories.map(category => category.color)}
            style={{
                labels: {
                    fontSize: RFValue(18),
                    fontWeight: 'bold',
                    fill: theme.colors.background,
                }
            }}
            labelRadius={50}
            x="formattedPercent"
            y="total"
            />
            </ChartContent>

        {totalByCategories.map(item => (
        <HistoryCard key={item.key} title={item.name} amount={item.formattedTotal} color={item.color} />
        ))}
        </Content>
       }


        </Container>
    )
}