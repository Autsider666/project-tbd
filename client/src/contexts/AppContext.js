import { useContext, useState, createContext } from 'react';

const AppContext = createContext();

const useApp = () => useContext(AppContext);



const AppProvider = ({ children }) => {

    const [snackbar, setSnackbar] = useState({
        visible: false,
        message: '',
        severity: 'warning',
    })

    const [wikiModal, setWikiModal] = useState(false)
    const [worldDeathModal, setWorldDeathModal] = useState(false)

    // 'success' | 'info' | 'warning' | 'error'

    const hideSnackbar = () => setSnackbar({ visible: false })
    const displaySnackbar = (message = 'Random Message', severity = 'error') => setSnackbar({ visible: true, message, severity })


    const value = {
        snackbar, hideSnackbar, displaySnackbar,
        wikiModal, setWikiModal,
        worldDeathModal, setWorldDeathModal,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export {
    useApp,
    AppProvider
}