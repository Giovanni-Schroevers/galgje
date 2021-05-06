import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface Props {
  open: boolean,
  text: string,
  title: string,
  handleClose(): void,
  submitWord(word: string): void
}

const Popup = ({open, text, title, handleClose, submitWord} : Props) => {
  const [word, setWord] = useState('');

  const setWordValue = (e: any) => {
    setWord(e.target.value)
  }
  
  const handleSubmit = () => {
    submitWord(word);
    handleClose();
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {text}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Word"
            type="text"
            fullWidth
            onChange={setWordValue}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Popup;
