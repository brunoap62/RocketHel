import { HStack, IconButton, Text, useTheme, Heading } from 'native-base';
import { color } from 'native-base/lib/typescript/theme/styled-system';
import { CaretLeft } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';

type Props = StyleProps & {
    title: string;
}


export function Header({ title, ...rest }: Props) {

    const { colors } = useTheme();
    const navegation = useNavigation();

    function handerGoback() {
        navegation.goBack();
    }

    return (
        <HStack
            W="full"
            justifyContent="space-between"
            alignItems="center"
            bg="gray.600"
            pb={6}
            pt={12}
            {...rest}
        >


            <IconButton
                icon={<CaretLeft color={colors.gray[200]} size={30} />}
                onPress={handerGoback}
            />


            <Heading color="gray.100" textAlign="center" fontSize="lg" flex={1} ml={-9}>
                {title}
            </Heading>

        </HStack>
    );
} 