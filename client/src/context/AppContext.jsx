import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Initialize socket connection
    useEffect(() => {
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    // Listen to socket events
    useEffect(() => {
        if (socket) {
            socket.on('notification', (data) => {
                setNotifications((prev) => [data, ...prev]);
                // Also could trigger a toast here
            });
        }
    }, [socket]);

    // Handle Auth State
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            // In a real app we would decode token or fetch user profile
            setUser({ name: 'Admin User', email: 'admin@techstartup.com' });
        } else {
            localStorage.removeItem('token');
            setUser(null);
        }
    }, [token]);

    const login = (newToken) => {
        setToken(newToken);
    };

    const logout = () => {
        setToken(null);
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        // Apply theme to document
        if (!isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <AppContext.Provider value={{
            user, token, login, logout,
            socket, notifications,
            isDarkMode, toggleTheme
        }}>
            {children}
        </AppContext.Provider>
    );
};
