import { VStack, Text, HStack, useTheme, ScrollView, Box } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { OrderFiresSotreDTO } from '../DTOs/orderDTO';
import { CircleWavyCheck, Hourglass, DesktopTower, Clipboard } from 'phosphor-react-native';

import { deteFormat } from '../utils/firestoreDateFormat';

import { OrderProps } from '../components/Order';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { CardDetails } from '../components/CardDetails'
import { Input } from '../components/input';
import { Button } from '../components/Button';
import { Alert } from 'react-native';


type RouteParams = {
    orderId: string;
}

type OrderDetails = OrderProps & {
    description: string;
    solution: string;
    closed: string;
}




export function Details() {
    const [isLoading, setIsLoading] = useState(true);
    const [solution, setSolution] = useState('');
    const [order, SetOrder] = useState<OrderDetails>({} as OrderDetails);
    const { colors } = useTheme();
    const route = useRoute();
    const { orderId } = route.params as RouteParams;
    const navigation = useNavigation();

    function handleOrderClose() {
        if (!solution) {
            return Alert.alert('Solicitação', 'Informa a solução para encerrar a solicitação');
        }

        firestore()
            .collection<OrderFiresSotreDTO>('orders')
            .doc(orderId)
            .update({
                status: 'closed',
                solution,
                closed_at: firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                Alert.alert('Solicitação', "Encerrada");
                navigation.goBack();
            })
            .catch((error) => {
                Alert.alert('Solicitação', "Erro");
                console.log(error);
            })
    }


    useEffect(() => {
        firestore()
            .collection<OrderFiresSotreDTO>('orders')
            .doc(orderId)
            .get()
            .then((doc) => {
                const { patrimony, description, status, created_at, closed_at, solution } = doc.data();
                const closed = closed_at ? deteFormat(closed_at) : null;

                SetOrder({
                    id: doc.id,
                    patrimony,
                    description,
                    status,
                    solution,
                    when: deteFormat(created_at),
                    closed

                });


                setIsLoading(false);
            })
    }, [])

    if (isLoading) {
        return <Loading />
    }

    return (
        <VStack flex={1} bg="gray.700">
            <Box px={6} bg="gray.600">
                <Header title="Solicitação" />
            </Box>


            <HStack
                bg="gray.500"
                justifyContent="center"
                p={4}
            >
                {
                    order.status === 'closed'
                        ? <CircleWavyCheck size={22} color={colors.green[300]} />
                        : <Hourglass size={22} color={colors.green[300]} />
                }
                <Text
                    fontSize="sm"
                    color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
                    ml={2}
                    textTransform="uppercase"
                >
                    {order.status === 'closed' ? 'finalizado' : 'Em andamento'}
                </Text>
            </HStack>
            <ScrollView mx={5} showsVerticalScrollIndicator={false} >
                <CardDetails
                    title="Equipamento"
                    description={`Patrimonio ${order.patrimony}`}
                    icon={DesktopTower}

                />
                <CardDetails
                    title="Descrição do problema"
                    description={`Descrição : ${order.description}`}
                    icon={Clipboard}
                    footer={`Registrado em ${order.when}`}

                />

                <CardDetails
                    title="Solução"
                    description={order.solution}
                    icon={CircleWavyCheck}
                    footer={order.closed && `Encerrado em ${order.closed}`}
                >
                    {
                        order.status === 'open' &&
                        <Input
                            placeholder='Descrição da solução'
                            onChangeText={setSolution}
                            h={24}
                            textAlignVertical="top"
                            multiline
                        />

                    }
                </CardDetails>


            </ScrollView>

            {
                order.status === 'open' &&
                <Button
                    title="Encerrar Solicitação"
                    m={5}
                    onPress={handleOrderClose}
                />
            }
        </VStack >
    );
}  