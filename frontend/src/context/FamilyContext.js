import React, { createContext, useState, useContext, useCallback } from 'react';
import { familyService } from '../services/familyService';
import { useAuth } from './AuthContext';

const FamilyContext = createContext();

export const useFamily = () => {
    const context = useContext(FamilyContext);
    if (!context) {
        throw new Error('useFamily must be used within a FamilyProvider');
    }
    return context;
};

export const FamilyProvider = ({ children }) => {
    const [family, setFamily] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user, updateUser } = useAuth();

    const fetchMembers = useCallback(async () => {
        if (!user?.familyId) return;

        try {
            setLoading(true);
            const data = await familyService.getMembers();
            setFamily({ name: data.familyName, inviteCode: data.inviteCode });
            setMembers(data.members);
        } catch (error) {
            console.error('Error fetching members:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const createFamily = async (familyData) => {
        const data = await familyService.createFamily(familyData);
        setFamily(data.family);
        updateUser({ ...user, familyId: data.family.id });
        return data;
    };

    const joinFamily = async (inviteCode) => {
        const data = await familyService.joinFamily(inviteCode);
        setFamily(data.family);
        updateUser({ ...user, familyId: data.family.id });
        await fetchMembers();
        return data;
    };

    const leaveFamily = async () => {
        await familyService.leaveFamily();
        setFamily(null);
        setMembers([]);
        updateUser({ ...user, familyId: null });
    };

    const value = {
        family,
        members,
        loading,
        fetchMembers,
        createFamily,
        joinFamily,
        leaveFamily,
        hasFamily: !!user?.familyId
    };

    return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>;
};
