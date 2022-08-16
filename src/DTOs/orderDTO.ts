import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export type OrderFiresSotreDTO = {
    patrimony: string;
    description: string;
    status: 'open' | 'closed',
    solution?: string;
    created_at: FirebaseFirestoreTypes.Timestamp;
    created_atw?: FirebaseFirestoreTypes.Timestamp;
}