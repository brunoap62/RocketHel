import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'

export function deteFormat(timestamp: FirebaseFirestoreTypes.Timestamp) {
    if (timestamp) {
        const date = new Date(timestamp.toDate());

        const day = date.toLocaleDateString('pt-BR');
        const hour = date.toLocaleTimeString('pt-BR');

        return `${day} as ${hour}`;
    }

}