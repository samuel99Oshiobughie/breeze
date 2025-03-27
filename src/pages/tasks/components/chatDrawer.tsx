// ChatDrawer.tsx - AI Chat Drawer Component
import React, { useState, useRef, useEffect } from 'react';
import { 
  Drawer, 
  Box, 
  Typography, 
  TextField, 
  IconButton, 
  Paper, 
  Avatar, 
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { 
  Close as CloseIcon,
  Send as SendIcon,
  SmartToy as BotIcon
} from '@mui/icons-material';
import useBreezeHooks from '@/hooks/useBreezeHooks';

interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
}


const ChatDrawer: React.FC<ChatDrawerProps> = ({ open, onClose }) => {
  const { loading, setLoading, messages, setMessages, getAIResponse } = useBreezeHooks();  
  const [inputValue, setInputValue] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = { 
      id: messages?.length! + 1, 
      text: inputValue, 
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages( userMessage);
    setInputValue('');
    setLoading(true);
    
    await getAIResponse(inputValue);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        zIndex: 50,
        "& .MuiDrawer-paper": {
          width: { xs: "100%", sm: 380 },
          boxSizing: "border-box",
          borderRadius: { xs: 0, sm: "12px 0 0 12px" },
          top: "64px",
          height: "calc(100% - 64px)",
        },
      }}
      
    >
      {/* Chat Header */}
      <Box className="p-4 flex items-center justify-between border-b border-gray-200">
        <Box className="flex items-center">
          <Avatar className="bg-blue-600 mr-2">
            <BotIcon />
          </Avatar>
          <Typography variant="subtitle1" className="font-medium">
            Task Assistant
          </Typography>
        </Box>
        <IconButton onClick={onClose} edge="end">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Messages Container */}
      <Box className="p-4 flex-grow overflow-auto flex flex-col gap-4 bg-gray-50" sx={{ height: 'calc(100vh - 140px)' }}>
        {messages?.map((message) => (
          <Box
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-1`}
          >
            {!message.isUser && (
              <Avatar className="bg-blue-600 mr-2 w-8 h-8">
                <BotIcon fontSize="small" />
              </Avatar>
            )}
            <Box className="max-w-[75%]">
              <Paper
                elevation={0}
                className={`p-3 rounded-lg ${message.isUser ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}
              >
                <Typography variant="body2">{message.text}</Typography>
              </Paper>
              <Typography 
                variant="caption" 
                className={`pl-2 text-gray-500 block ${message.isUser ? 'text-right' : 'text-left'}`}
              >
                {formatTime(message.timestamp)}
              </Typography>
            </Box>
            {message.isUser && (
              <Avatar className="bg-purple-600 ml-2 w-8 h-8">
                {/* User's initial or icon */}
                U
              </Avatar>
            )}
          </Box>
        ))}

        {loading && (
          <Box className="flex items-center ml-12">
            <CircularProgress size={24} />
            <Typography variant="body2" className="ml-2 text-gray-500">
              Thinking...
            </Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        className="p-4 border-t border-gray-200 bg-white"
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Create a new task..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={loading}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton 
                  edge="end" 
                  type="submit" 
                  disabled={!inputValue.trim() || loading}
                  color="primary"
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
            sx: { 
              borderRadius: 4,
              '& fieldset': {
                borderColor: 'rgba(0, 0, 0, 0.12)',
              },
            }
          }}
          className="rounded-full"
        />
      </Box>
    </Drawer>
  );
};

export default ChatDrawer;