import { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Modal, 
  Typography, 
  IconButton, 
  Grid2,
  Menu, 
  MenuItem,
  Paper,
  Skeleton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import DeleteModal from "./delete";
import useBreezeHooks from '@/hooks/useBreezeHooks';


const NotesPage = () => {
  const {notes, submitNewNote, fetchAllNotes, updateNote, deleteNote, loading } = useBreezeHooks();
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const MAX_TITLE_LENGTH = 24;
  const MAX_CONTENT_LENGTH = 80;


  useEffect(() => {
    fetchAllNotes();
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
  });

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, noteId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedNoteId(noteId);
    
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNoteTitle('');
    editor?.commands.setContent('');
    setSelectedNoteId(null);
  };

  const handleOpenDeleteModal = () => {
    if (selectedNoteId) {
      setIsDeleteModalOpen(true);
      handleCloseMenu();
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedNoteId(null);
  };

  const handleSaveNote = () => {
    if (!editor) return;
    
    const newNote = {
      title: noteTitle,
      content: editor.getHTML(),
    };

    submitNewNote(newNote)
    handleCloseModal();
  };

  const handleDeleteNote = () => {
    if (selectedNoteId) {
      const noteUpdate = {deleted: true};
      deleteNote({noteObject: noteUpdate, noteId: selectedNoteId})
    }
    handleCloseDeleteModal();
  };

  const handleUpdateNote = async (noteId: string) => {
    if (!editor) return;

    const noteUpdate = {
      title: noteTitle,
      content: editor.getHTML()
    }

    await updateNote({noteObject: noteUpdate, noteId: noteId})
    fetchAllNotes();
    handleCloseModal();
  }

  const handleEditNote = () => {
    if (selectedNoteId) {
      const noteToEdit = notes?.find(note => note._id === selectedNoteId);
      if (noteToEdit && editor) {
        setNoteTitle(noteToEdit.title);
        editor.commands.setContent(noteToEdit.content);
        setIsModalOpen(true);
      }
      handleCloseMenu();
    }
  };

  const handleOpenNote = () => {
    if (selectedNoteId) {
        setIsNoteOpen(true);
        handleCloseMenu();
    }
  }

  const handleCloseNote = () => {
    setSelectedNoteId(null);
    setIsNoteOpen(false);
  }

  const filteredNotes = notes?.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
      <div className="p-6">
        <Typography variant="h4" className="mb-6">
          Notes
        </Typography>

        <div className="flex flex-col note-sm:flex-row justify-between note-sm:items-center mb-6 gap-3">
          <TextField
            placeholder="Search notes..."
            variant="outlined"
            size="small"
            className="w-full md:w-[20rem]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            className="min-w-fit max-w-[16rem]"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenModal}
          >
            Add New Note
          </Button>
        </div>

        <Grid2 container spacing={3}>
        {loading ? (
          <Grid2 container spacing={3}>
            {Array.from(new Array(6)).map((_, index) => (
              <Grid2 key={index} sx={{ width: { xs: "100%", sm: "50%", md: "33.33%" } }}>
                <Paper className="p-4 relative hover:shadow-lg transition-shadow">
                  <Skeleton variant="text" width="70%" height={30} />
                  <Skeleton variant="rectangular" width="100%" height={80} className="mt-2" />
                  <Skeleton variant="text" width="40%" height={20} className="mt-2" />
                </Paper>
              </Grid2>
            ))}
          </Grid2>
        ) : filteredNotes!== undefined && filteredNotes?.length > 0 ?(filteredNotes?.map((note) =>{ 
          
          const truncatedContent =
          note.content.length > MAX_CONTENT_LENGTH
            ? `${note.content.substring(0, MAX_CONTENT_LENGTH)}...`
            : note.content;

          return(
              <Grid2 
              sx={{ 
                width: { xs: "100%", sm: "50%", md: "33.33%" } 
              }} 
              key={note._id}
              >
                <Paper className="p-4 relative hover:shadow-lg transition-shadow">
                  <div className='flex justify-end'>
                    <IconButton
                      className="absolute top-2 right-2"
                      onClick={(e) => handleOpenMenu(e, note._id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </div>
                  <Typography variant="h6" className="mb-2">
                    {note.title.length > MAX_TITLE_LENGTH
                    ? `${note.title.substring(0, MAX_TITLE_LENGTH)}...`
                    : note.title}
                  </Typography>

                  <div 
                    className="prose prose-sm text-gray-600 mb-3"
                    dangerouslySetInnerHTML={{ __html: truncatedContent }}
                    // MAX_CONTENT_LENGTH
                  />
                  <Typography variant="caption" className="text-gray-500 mt-2 block">
                    Created {new Date(note.createdAt).toLocaleDateString()}
                  </Typography>
                </Paper>
              </Grid2>
          )
        })): (
            <Box className="flex justify-center flex-grow mt-[90px]">
              <Typography variant="h6" className="text-gray-500 mt-4">
                No notes yet! Start by creating a new one.
              </Typography>
            </Box>
          )
        }
        </Grid2>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={handleOpenNote}>Open Note</MenuItem>
          <MenuItem onClick={handleEditNote}>Edit Note</MenuItem>
          <MenuItem onClick={handleOpenDeleteModal}>Delete Note</MenuItem>
        </Menu>

        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          className="flex items-center justify-center"
        >
          <Box className="bg-white p-6 rounded-lg w-full max-w-2xl mx-4">
            <Typography variant="h6" className="mb-4">
              {selectedNoteId ? 'Edit Note' : 'Add New Note'}
            </Typography>
            <TextField
              label="Note Title"
              variant="outlined"
              fullWidth
              className="mb-4"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
            />
            <div className="border rounded-md p-4 mb-4 min-h-[200px]">
              <EditorContent editor={editor} />
            </div>
            <div className="flex gap-2">
              <Button variant="contained" onClick={() => selectedNoteId ? handleUpdateNote(selectedNoteId) : handleSaveNote()}>
                Save
              </Button>
              <Button variant="outlined" onClick={handleCloseModal}>
                Cancel
              </Button>
            </div>
          </Box>
        </Modal>

        <Modal
        open={isNoteOpen}
        onClose={handleCloseNote}
        className="flex items-center justify-center"
        >
        <div className="bg-white m-5 p-6 rounded-lg shadow-lg relative w-106 max-w-full">
          <button 
          onClick={handleCloseNote} 
          className="absolute top-2 right-2 text-lg hover:text-gray-700"
          >
          ×
          </button>
          <div className="mt-3 p-5 bg-gray-50 border border-gray-200 rounded-md font-serif text-gray-700">
          <div dangerouslySetInnerHTML={{ __html: String(notes?.find(note => note._id === selectedNoteId)?.content) }} /> 
          </div>
        </div>
        </Modal>

        <DeleteModal
            open={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            onConfirm={handleDeleteNote}
            noteTitle={String(notes?.find(note => note._id === selectedNoteId)?.title)}
          />
      </div>
  );
};

export default NotesPage;