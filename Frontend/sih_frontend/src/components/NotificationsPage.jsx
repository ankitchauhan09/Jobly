import React, {useEffect, useState} from 'react';
import { RiNotificationLine, RiCheckboxCircleFill, RiErrorWarningFill } from 'react-icons/ri';
import { TablePagination } from '@mui/material';
import {useNotification} from "../contexts/NotificationContext.jsx";

// Dummy notifications data (replace with actual backend service later)
const DEMO_NOTIFICATIONS = [
    {
        id: 1,
        type: 'success',
        title: 'Application Submitted',
        message: 'Your application for Senior Software Engineer at TechCorp has been successfully submitted.',
        timestamp: '2024-02-15T10:30:00Z',
        read: false
    },
    {
        id: 2,
        type: 'warning',
        title: 'Interview Reminder',
        message: 'Your interview for Product Designer role is scheduled tomorrow at 2 PM.',
        timestamp: '2024-02-14T15:45:00Z',
        read: false
    },
    {
        id: 3,
        type: 'info',
        title: 'Profile Update',
        message: 'Your profile has been updated successfully.',
        timestamp: '2024-02-13T09:15:00Z',
        read: true
    },
    {
        id: 4,
        type: 'success',
        title: 'Job Recommendation',
        message: 'We found 3 new job matches based on your profile.',
        timestamp: '2024-02-12T11:20:00Z',
        read: true
    }
];

const NotificationsPage = () => {
    const { notification, addNotification, removeNotification, markAllAsRead } = useNotification();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        markAllAsRead()
    }, [markAllAsRead]);

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success':
                return <RiCheckboxCircleFill className="text-green-500" size={24} />;
            case 'warning':
                return <RiErrorWarningFill className="text-orange-500" size={24} />;
            default:
                return <RiNotificationLine className="text-blue-500" size={24} />;
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-grey-900 min-h-screen">
            <div className="container mx-auto px-4 py-10">
                <div
                    id="notifications-header"
                    className="backdrop-blur-lg bg-[#3a3a3a] rounded-md mb-6"
                >
                    <h3 className="text-white text-2xl font-plain flex items-center px-6 py-4">
                        <RiNotificationLine size={24} color="white" className="mr-2" />
                        <span className="text-white">Notifications</span>
                    </h3>
                    <div className="w-full bg-white h-0.5 mb-4"></div>
                </div>

                <div>
                    <TablePagination
                        className="text-white"
                        component="div"
                        count={notification.length}
                        page={page}
                        onPageChange={handlePageChange}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        sx={{
                            color: "white",
                            "& .MuiTablePagination-selectLabel": { color: "white" },
                            "& .MuiTablePagination-select": { color: "white" },
                            "& .MuiTablePagination-selectIcon": { color: "white" },
                            "& .MuiTablePagination-displayedRows": { color: "white" },
                            "& .MuiTablePagination-actions": { color: "white" },
                            "& .MuiIconButton-root": { color: "white" },
                        }}
                    />
                </div>

                <div className="space-y-4">
                    {notification
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((notification) => (
                            <div
                                key={notification.id}
                                className={`
                  flex items-start p-4 rounded-md
                  ${notification.read ? 'bg-neutral-800' : 'bg-neutral-700 border border-orange-500/30'}
                `}
                            >
                                <div className="mr-4 mt-1">
                                    {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-grow">
                                    <h4 className="text-white font-semibold mb-1">
                                        {notification.title}
                                    </h4>
                                    <p className="text-neutral-300 text-sm mb-2">
                                        {notification.message}
                                    </p>
                                    <span className="text-neutral-400 text-xs">
                    {formatTimestamp(notification.timestamp)}
                  </span>
                                </div>
                                {!notification.read && (
                                    <div className="w-2 h-2 bg-orange-500 rounded-full self-start ml-2"></div>
                                )}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;