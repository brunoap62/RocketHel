
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';
import { useState } from 'react';
import { VStack, Heading, Icon, useTheme } from 'native-base';
import { Key, Envelope } from 'phosphor-react-native';

import Logo from '../assets/logo_primary.svg';

import { Input } from '../components/input';
import { Button } from '../components/Button';

export function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsloading] = useState(false);

    function handleSignin() {

        if (!email || !password) {
            return Alert.alert('Entrar', 'Informe e-mail e senha');
        }

        setIsloading(true);

        auth()
            .signInWithEmailAndPassword(email, password)
            .catch((error) => {
                console.log(error);
                setIsloading(false);

                if (error.code === 'auth/invalid-email') {
                    return Alert.alert('Entrar', 'E-mail ou senha invalido.');
                }

                if (error.code === 'auth/wrong-password') {
                    return Alert.alert('Entrar', 'E-mail ou senha invalido.');
                }

                if (error.code === 'auth/user-not-found') {
                    return Alert.alert('Entrar', 'Usuario não cadastrado.');
                }

                return Alert.alert('Entrar', 'Não foi possivel acessar');






            });
    }




    const { colors } = useTheme();
    return (
        <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
            <Logo />

            <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
                Acesse sua conta
            </Heading>

            <Input
                placeholder="E-mail"
                mb={4}
                InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />}
                onChangeText={setEmail}
            />
            <Input
                placeholder="Senha"
                secureTextEntry
                InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
                mb={8}
                onChangeText={setPassword}
            />

            <Button
                title="Entrar"
                w="full"
                isLoading={isLoading}
                onPress={handleSignin}

            />

        </VStack >
    )
} 