import { VStack } from 'native-base';
import { Header } from '../components/Header';
import { Input } from '../components/input';
import { Button } from '../components/Button';
import { useState } from 'react';
import { Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';


export function Register() {

    const [isLoading, SetIsLoading] = useState(false);
    const [patrimony, setPatrimony] = useState('');
    const [description, setDescription] = useState('');

    const navigation = useNavigation();

    function handlerNewOrderRegister() {

        if (!patrimony || !description) {
            return Alert.alert('Registrar', 'Preencha todos os campos');
        }

        SetIsLoading(true);

        firestore()
            .collection('orders')
            .add({
                patrimony,
                description,
                status: 'open',
                created_at: firestore.FieldValue.serverTimestamp()
            })
            .then(response => {
                Alert.alert('Solicitação', "Cadastrado com sucesso");
                navigation.goBack();
            })
            .catch((error) => {
                console.log(error);
                SetIsLoading(false);
                return Alert.alert('Erro', "Houve algum problema");
            });
    }

    return (
        <VStack flex={1} p={6} bg="gray.600">
            <Header title="Nova solicitação" />

            <Input
                placeholder="Numero do patrimonio"
                mt={4}
                onChangeText={setPatrimony}
            />
            <Input
                onChangeText={setDescription}
                placeholder="Descrição do problema"
                flex={1}
                mt={5}
                multiline
                textAlignVertical='top'
            />

            <Button
                isLoading={isLoading}
                onPress={handlerNewOrderRegister}
                title="Cadastrar" mt={5}
            />


        </VStack>
    );
}  