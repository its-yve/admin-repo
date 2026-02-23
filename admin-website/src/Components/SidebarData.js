import React from 'react';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ArticleIcon from '@mui/icons-material/Article';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TopicIcon from '@mui/icons-material/Topic';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

export const SidebarData = [
    {
        title: "Robot Status",
        icon: <SmartToyIcon />,
        link: "/robotstatus"
    },

    {
        title: "Student Logs",
        icon: <ArticleIcon />,
        link: "/studentlogs"
    },

    {
        title: "Reports",
        icon: <NotificationsIcon />,
        link: "/reports"
    },

    {
        title: "Content Management",
        icon: <TopicIcon />,
        link: "/contentmanagement"
    },

    { type: "divider" },

    {
        title: "Settings",
        icon: <SettingsIcon />,
        link: "/settings"
    },

    { type: "divider" },

    {
        title: "Log Out",
        icon: <LogoutIcon />,
        link: "/logout"
    }
];
