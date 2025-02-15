    import {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";

    const NotificationContext = createContext();

    export const useNotification = () => {
        const context = useContext(NotificationContext);
        if (!context) {
            throw new Error('useNotification must be used within a NotificationProvider');
        }
        return context;
    };

    export const NotificationProvider = ({children}) => {
        const [notifications, setNotifications] = useState([]);
        const eventSource = useRef(null);

        const addNotification = useCallback((notification) => {
            // console.log("notification received")
            setNotifications(prev => [
                ...prev,
                {
                    ...notification,
                    id: Date.now(),
                    timestamp: new Date().toISOString(),
                    read: false
                }
            ]);
        }, []);

        const clearNotifications = useCallback(() => {
            setNotifications([]);
        }, []);

        const removeNotification = useCallback((id) => {
            setNotifications(prev => prev.filter(notification => notification.id !== id));
        }, []);

        const markAsRead = useCallback((id) => {
            setNotifications(prev =>
                prev.map(notification =>
                    notification.id === id
                        ? {...notification, read: true}
                        : notification
                )
            );
        }, []);


        const markAllAsRead = useCallback(() => {
            setNotifications(prev =>
                prev.map(notification => ({ ...notification, read: true }))
            );
        }, []);

        useEffect(() => {
            // console.log("intialising sse")
            let source;
            const initSSE = () => {
                // Ensure we don't create multiple connections
                if (eventSource.current) {
                    eventSource.current.close();
                }

                eventSource.current = new EventSource("http://localhost:9010/sse/notifications/all");
                // console.log("event source created")
                eventSource.current.onopen = () => {
                    console.log("SSE Connection opened");
                };

                eventSource.current.onmessage = (event) => {
                    try {
                        const notification = JSON.parse(event.data);
                        addNotification(notification);
                    } catch (error) {
                        // console.error("Error parsing notification:", error);
                    }
                };

                eventSource.current.onerror = (error) => {
                    // console.error("SSE Connection Error", error);
                    eventSource.current.close();

                    // Attempt reconnection after a delay
                    setTimeout(() => {
                        // console.log("Attempting to reconnect SSE...");
                        initSSE();
                    }, 5000);
                };
            };

            // Only initiate if no existing connection
            initSSE()

            // Cleanup function
            return () => {
                if (eventSource.current) {
                    eventSource.current.close();
                }
            };
        }, [addNotification, eventSource]);

        const contextValue = {
            notification: notifications,
            addNotification,
            removeNotification,
            clearNotifications,
            markAsRead,
            markAllAsRead
        };
    
        return (
            <NotificationContext.Provider value={contextValue}>
                {children}
            </NotificationContext.Provider>
        );
    };