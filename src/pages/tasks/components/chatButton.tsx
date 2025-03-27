// ChatIcon.tsx - Floating Chat Button Component
import React from 'react';
import { Fab, Badge } from '@mui/material';
import { Chat as ChatIcon } from '@mui/icons-material';

interface FloatingChatButtonProps {
  onClick: () => void;
  newMessages?: number;
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ 
  onClick, 
  newMessages = 0 
}) => {
  return (
    <Fab
      color="primary"
      aria-label="chat"
      onClick={onClick}
      className="bg-blue-600 hover:bg-blue-700 shadow-lg"
    >
      <Badge badgeContent={newMessages} color="error" overlap="circular">
        <ChatIcon />
      </Badge>
    </Fab>
  );
};

export default FloatingChatButton;