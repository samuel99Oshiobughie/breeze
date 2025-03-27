import { useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    Box,
  } from "@mui/material";
  import { Menu } from "@mui/icons-material";
  import menuItems from "./components/menuItem";
  import Link from "next/link";
  import { useRouter } from "next/router";
  
  
  const drawerWidth = 240;
  
  interface LayoutProps {
    children: React.ReactNode; 
  }

  
  const Layout: React.FC<LayoutProps> = ({ children }) => {
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  
    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };
  
    return (
      <Box className="flex min-h-screen bg-gray-50">
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar className="flex justify-between">
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { xs: 'block', md: 'none' } }} // Hide on desktop
            >
              <Menu />
            </IconButton>
            <Typography variant="h6" noWrap className="m">
              Breeze
            </Typography>
          </Toolbar>
        </AppBar>
  
        {/* Responsive Drawer */}
      <Drawer
        variant="temporary" 
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: 'block', md: 'none' }, 
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar /> 
        <Box sx={{ overflow: "auto" }}>
          <List>
            {menuItems.map((item) => (
              <Link href={item.path} key={item.text} passHref>
                <ListItemButton selected={router.pathname === item.path}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </Link>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Permanent Drawer for Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' }, // Hide on mobile, show on desktop
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar /> {/* Empty Toolbar to offset content below AppBar */}
        <Box sx={{ overflow: "auto" }}>
          <List>
            {menuItems.map((item) => (
              <Link href={item.path} key={item.text} passHref>
                <ListItemButton selected={router.pathname === item.path}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </Link>
            ))}
          </List>
        </Box>
      </Drawer>
  
        <Box component="main" sx={{ flexGrow: 1, p: 3}} className="overflow-x-hidden">
          <Toolbar /> 
          {children}
        </Box>
      </Box>
    );
  };
  
  export default Layout;
  