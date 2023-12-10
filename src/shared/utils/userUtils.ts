import { useContext } from 'react';
import { UserContext} from '../../contexts/userContext';
import { type UserContextType } from "../types/user.interface.ts";

export const useUserContext = (): UserContextType => {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }

    return context;
};
