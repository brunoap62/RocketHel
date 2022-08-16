import { HStack, IconButton, VStack, useTheme, Text, Heading, FlatList, Center } from 'native-base';
import { SignOut } from 'phosphor-react-native';
import Logo from '../assets/logo_secondary.svg';
import { Filter } from '../components/Filter';
import { useNavigation } from '@react-navigation/native';
import { Order, OrderProps } from '../components/Order';
import { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { ChatTeardropText } from 'phosphor-react-native';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore'
import { deteFormat } from '../utils/firestoreDateFormat'
import { Loading } from '../components/Loading';
import { isLoading } from 'expo-font';


export function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open');
    const { colors } = useTheme();
    const [orders, SetOrders] = useState<OrderProps[]>([]);

    const navigation = useNavigation();

    function handerNewOrder() {
        navigation.navigate('new')
    }

    function handerOpenDetails(orderId: string) {
        navigation.navigate('details', { orderId })
    }

    function handerLogout() {
        auth()
            .signOut()
            .catch(error => {
                console.log(error);
                return Alert.alert('Sair', 'Não foi possivel sair.');
            })
    }


    useEffect(() => {
        setIsLoading(true);

        const subscriber = firestore()
            .collection('orders')
            .where('status', '==', statusSelected)
            .onSnapshot(snapshot => {
                const data = snapshot.docs.map(doc => {
                    const { patrimony, description, status, created_at } = doc.data();

                    return {
                        id: doc.id,
                        patrimony,
                        description,
                        status,
                        when: deteFormat(created_at)
                    }

                });

                SetOrders(data);
                setIsLoading(false);
            });


        return subscriber;

    }, [statusSelected])


    return (
        <VStack flex={1} pb={6} bg="gray.700" >
            <HStack
                w="full"
                justifyContent="space-between"
                alignItems="center"
                bg="gray.600"
                pt={12}
                pb={5}
                px={6}
            >
                <Logo />

                <IconButton
                    onPress={handerLogout}
                    icon={<SignOut size={26} color={colors.gray[300]} />}
                />
            </HStack>


            <VStack flex={1} px={6}>
                <HStack
                    w="full"
                    mt={8}
                    mb={4}
                    justifyContent="space-between"
                    alignItems="center">
                    <Heading color="gray.100">
                        Meus Chamados
                    </Heading>
                    <Text color="gray.200">
                        {orders.length}
                    </Text>
                </HStack>


                <HStack space={3} mb={8}>
                    <Filter
                        type='open'
                        title="em andamento"
                        onPress={() => setStatusSelected('open')}
                        isActive={statusSelected === 'open'}
                    />

                    <Filter
                        type='closed'
                        title="finalizados"
                        onPress={() => setStatusSelected('closed')}
                        isActive={statusSelected === 'closed'}
                    />


                </HStack>


                {isLoading ? <Loading /> :
                    <FlatList

                        data={orders}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={item => item.id}
                        ListEmptyComponent={() => (
                            <Center>
                                <ChatTeardropText color={colors.gray[300]} size={40} />
                                <Text color="gray.300" fontSize="xl" mt={6} text-align="center">Você ainda não possui{'\n'}
                                    Solicitações {statusSelected === 'open' ? 'em andamento' : 'Finalizados'}
                                </Text>

                            </Center>
                        )}
                        _contentContainerStyle={{ paddingBottom: 100 }}
                        renderItem={({ item }) => <Order data={item} onPress={() => handerOpenDetails(item.id)} />}
                    />
                }





                <Button title='Nova Solicitação' onPress={handerNewOrder} />
            </VStack>
        </VStack>
    );
}