import React, {useEffect, useState } from 'react';
import {Alert
   // , Keyboard
    , Modal
  //  , TouchableNativeFeedback 
} from 'react-native';
import {useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form'
import uuid from 'react-native-uuid';
import { Button } from '../../components/Forms/Button'
import { InputHookForm } from '../../components/Forms/InputHookForm'
import { CategorySelectButton } from '../../components/Forms/CategorySelectButton'
import { TransactionButton } from '../../components/Forms/TransactionButtons'
import {CategorySelect} from '../../screens/CategorySelect'
import {Container, Header, Title, Form, Fields, TransactionsTypes } from './styles'

interface DataForm {
    name: string,
    amount: string,
}

const schemaYup = Yup.object().shape({
    name: Yup.string().required("Name is required."),
    amount: Yup.number().typeError('Only numbers').positive().required("price is required.")
});

export function Register (){
    const [transactionType, setTransactionType] = useState('');
const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [category, setCategory]=useState({
        key: 'category',
        name: 'Category',    });

    const navigation = useNavigation();

    const {
        handleSubmit,
        control,
        reset,
        formState: {errors},
   }  =useForm(
       {resolver: yupResolver(schemaYup)}
   );

    function handleSelectedTransactionType (type: 'positive' | 'negative'){
        setTransactionType(type)
    };


    function handleCloseSelectCategoryModal() {
        setCategoryModalOpen(false);
    };


    function handleOpenSelectCategoryModal() {
        setCategoryModalOpen(true);
    };

    async function handleRegister(form: DataForm){

        if(!transactionType){return Alert.alert('Select a kind of transaction.');}

        if(category.key === 'category'){return Alert.alert('Select a category.');}
        
        
        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date(),
        }
        
        
        try{
            
            const dataKey = '@gofinances:transactions';
            const data = await AsyncStorage.getItem(dataKey);
            const currentData = data ? JSON.parse(data) : [];

            const dataFormatted = [
                ...currentData,
                newTransaction
            ];

            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted)); 
            
                        reset();

            setTransactionType('');
            setCategory({
                key: 'category',
                name: 'Category'
            });

            navigation.navigate('List');
            
        }catch (error) {
            Alert.alert("It was not possible save.")
        }
    }


 /* useEffect(()=>{
     const dataKey = '@gofinances:transactions';
    async function loadTransactions() {
        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];
    
        console.log(transactions);
    
    }
    
    loadTransactions()
    
     async function removeData() {
        const response =  await AsyncStorage.removeItem(dataKey);           
    }
    removeData(); 
},[]) */


    return (
    //    <TouchableNativeFeedback onPress={Keyboard.dismiss} >
        <Container>
            <Header>
                <Title>Register</Title>
            </Header>
            <Form>
                <Fields>
            <InputHookForm
            control={control}
            name="name"
            placeholder='name'
            autoCapitalize="sentences"
            autoCorrect={false}
            error={errors.name && errors.name.message}
             />
             <InputHookForm
            control={control}
             name="amount"
             placeholder='price'
             keyboardType="numeric"
             error={errors.amount  &&  errors.amount.message}
              />
              <TransactionsTypes>
              <TransactionButton
              onPress={() => handleSelectedTransactionType('positive')} 
              type='up' 
              title='Income'
              isActive={transactionType === 'positive'}
               />
               <TransactionButton
              onPress={() => handleSelectedTransactionType('negative')} 
              type='down' 
              title='Debt'
              isActive={transactionType === 'negative'}
               />
              </TransactionsTypes>
              <CategorySelectButton 
              title={category.name} 
              onPress={handleOpenSelectCategoryModal}
              />
                </Fields>
              <Button 
              title='Send'
              onPress={handleSubmit(handleRegister)}
              />
            </Form>
            <Modal visible={categoryModalOpen} >
                <CategorySelect 
                category={category} 
                setCategory={setCategory}
                closeCategorySelect={handleCloseSelectCategoryModal}
                 />
            </Modal>
        </Container>
      //  </TouchableNativeFeedback>
    )
}