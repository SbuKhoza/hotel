import React, { useEffect, useState } from 'react';
import { Typography, Card, CardContent, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import Layout from '../components/Layout';

function Specials() {
  const [specials, setSpecials] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedSpecial, setSelectedSpecial] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    // Placeholder for fetching specials data
  }, []);

  const handleDelete = (id) => {
    // Placeholder for handling delete action
  };

  const handleOpen = (special = null) => {
    setSelectedSpecial(special);
    if (special) {
      setTitle(special.title);
      setDescription(special.description);
    } else {
      setTitle('');
      setDescription('');
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    // Placeholder for handling create/update action
  };

  return (
    <Layout title="Specials">
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add Special
      </Button>
      <Grid container spacing={3}>
        {specials.map(special => (
          <Grid item xs={12} sm={6} key={special.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{special.title}</Typography>
                <Typography variant="body2">{special.description}</Typography>
                <Button variant="outlined" color="primary" sx={{ mt: 2 }} onClick={() => handleOpen(special)}>Edit</Button>
                <Button variant="outlined" color="secondary" sx={{ mt: 2, ml: 2 }} onClick={() => handleDelete(special.id)}>Delete</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{selectedSpecial ? 'Edit Special' : 'Add Special'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setTitle(''); setDescription(''); }} color="warning">
            Clear Form
          </Button>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="success">
            {selectedSpecial ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

export default Specials;