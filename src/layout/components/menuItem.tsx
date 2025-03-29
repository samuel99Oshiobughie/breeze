
import { ReactNode } from "react";
import {
    Dashboard as DashboardIcon,
    List as ListIcon,
    CalendarToday as CalendarIcon,
    Folder as ProjectsIcon,
    Notes as NotesIcon,
    // Flag as GoalsIcon,
    Timer as TimerIcon,
    TrendingUp as AnalyticsIcon,
    Settings as SettingsIcon,
  } from "@mui/icons-material";


    interface MenuItem {
      text: string;
      icon: ReactNode;
      path: string;
    }

    const menuItems: MenuItem[] = [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
      { text: "Tasks", icon: <ListIcon />, path: "/tasks" },
      { text: "Calendar", icon: <CalendarIcon />, path: "/calendar" },
      { text: "Projects", icon: <ProjectsIcon />, path: "/projects" },
      { text: "Notes", icon: <NotesIcon />, path: "/notes" },
      // { text: "Goals", icon: <GoalsIcon />, path: "/goals" },
      { text: "Time Tracking", icon: <TimerIcon />, path: "/time-tracking" },
      { text: "Analytics", icon: <AnalyticsIcon />, path: "/analytics" },
      { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
    ];

    export default menuItems;