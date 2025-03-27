import React, { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";


interface SearchBarProps{
    onSearch: ({searchQuery}:{searchQuery: string}) => void;
}


const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleClear = () => {
    setSearchQuery("");
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
        onSearch({searchQuery});
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    onSearch({ searchQuery: value }); // Ensure onSearch is called
  };

  return (
    <TextField
      size="small"
      variant="outlined"
      placeholder="Search..."
      value={searchQuery}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      className="rounded-[25px] h-[40px] w-full md:w-[20rem] text-sm"
      sx={{
        "& .MuiOutlinedInput-root": {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "black", // Remove blue border on focus
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "black", // Keep black border on hover
          },
        },
      }}
      slotProps={{
        input: {
            startAdornment: (
            <InputAdornment position="end">
                {searchQuery && (
                <IconButton onClick={handleClear} edge="end" className="text-gray-500">
                    <ClearIcon />
                </IconButton>
                )}
                <IconButton onClick={() => onSearch({ searchQuery })} edge="end" className="text-gray-500">
                <SearchIcon />
                </IconButton>
            </InputAdornment>
            ),
        }
      }}
    /> );
};

export default SearchBar;