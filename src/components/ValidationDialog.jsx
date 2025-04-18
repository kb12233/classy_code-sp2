// src/components/ValidationDialog.jsx
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Button from '@mui/material/Button';

export default function ValidationDialog({ open, onClose, title, message }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="validation-dialog-title"
      aria-describedby="validation-dialog-description"
      PaperProps={{
        sx: {
          backgroundColor: '#212121',
          color: '#eee',
          fontFamily: 'JetBrains Mono, monospace',
          border: '1px solid #454545',
        }
      }}
    >
      <DialogTitle id="validation-dialog-title" sx={{ fontFamily: 'JetBrains Mono, monospace' }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="validation-dialog-description" sx={{ color: '#B4B4B4', fontFamily: 'JetBrains Mono, monospace' }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose} 
          sx={{ 
            color: '#B6D9D7', 
            fontFamily: 'JetBrains Mono, monospace',
            '&:hover': {
              backgroundColor: 'rgba(182, 217, 215, 0.1)'
            }
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}