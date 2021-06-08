import React from 'react'
import { FlatList } from 'react-native-gesture-handler'
import {Container, Header, Title, Category, Name, Icon, Separator,
    Footer
} from './styles'
import { categories} from '../../../utils/categories'
import { Button } from '../../components/Forms/Button'

interface Category {
    key: string;
    name: string;
}

interface Props {
    category: Category;
    setCategory: (category: Category) => void;
    closeCategorySelect: () => void;
}

export function CategorySelect ({category, closeCategorySelect, setCategory}: Props) {
function handleCategorySelected (category: Category) {
    setCategory(category);
}

    return (
        <Container >
            <Header>
                <Title>Category</Title>
            </Header>
            <FlatList
            data={categories}
            style={{flex: 1, width: '100%'}}
            keyExtractor={(item)=> item.key}
            renderItem={({item})=>(
                <Category
                onPress={() =>handleCategorySelected(item) }
                isActive={category.key === item.key}
                >
                    <Icon name={item.icon} />
                    <Name>{item.name} </Name>
                </Category>
            )}
            ItemSeparatorComponent={()=> <Separator />}
             />

             <Footer>
                 <Button 
                 title="Selection" 
                 onPress={closeCategorySelect}
                 />
             </Footer>
        </Container>
    )
}