import React, {useEffect, useState, createContext, useContext} from 'react'
import {Session, User} from '@supabase/supabase-js'
import {supabase} from '../../lib/initSupabase'

export const UserContext = createContext<{user: User | null; session: Session | null}>({
    user: null,
    session: null,
})

export const UserContextProvider = (props: any) => {
    const [session, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const getSession = async () => {
            const {data, error} = await supabase.auth.getSession()
            if (error) {
                console.log('ERROR >>>>>>>> GET SESSION', error);
                return null;
            }
            setSession(session)
            setUser(session?.user ?? null)
        }

        getSession();

        const {data: stateChangeListener} = supabase.auth.onAuthStateChange((event, session) => {
            console.log(`Supabase auth event: ${event}`)
            console.log(`Supabase auth session: ${session}`)

            if (event === 'INITIAL_SESSION') {
                console.log('EVENT ::::::: INITIAL_SESSION');
            } else if (event === 'SIGNED_IN') {
                console.log('EVENT ::::::: SIGNED_IN');
            } else if (event === 'SIGNED_OUT') {
                console.log('EVENT ::::::: SIGNED_OUT');
            } else if (event === 'PASSWORD_RECOVERY') {
                console.log('EVENT ::::::: PASSWORD_RECOVERY');
            } else if (event === 'TOKEN_REFRESHED') {
                console.log('EVENT ::::::: TOKEN_REFRESHED');
            } else if (event === 'USER_UPDATED') {
                console.log('EVENT ::::::: USER_UPDATED');
            }

            setSession(session)
            setUser(session?.user ?? null)
        });

        return () => {
            stateChangeListener.subscription!.unsubscribe()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getSession = async () => {
        const {data, error} = await supabase.auth.getSession()
        if (error) {
            console.log('ERROR >>>>>>>> GET SESSION', error);
            return null;
        }
        return data.session;
    }

    const value = {
        session,
        user,
    }
    return <UserContext.Provider value={value} {...props} />
}

export const useUser = () => {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error(`useUser must be used within a UserContextProvider.`)
    }
    return context
}
