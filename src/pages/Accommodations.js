
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { getAccommodationsFromFirestore } from '../services/firestoreService';
import Layout from '../components/Layout';

function Accommodations() {
  const [accommodations, setAccommodations] = useState([]);

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const accommodationsList = await getAccommodationsFromFirestore();
        setAccommodations(accommodationsList);
      } catch (error) {
        console.error("Failed to fetch accommodations:", error);
      }
    };

    fetchAccommodations();
  }, []);

  return (
    <Layout title="Accommodations">
      <Grid container spacing={3}>
        {accommodations.map(accommodation => (
          <Grid item xs={12} sm={6} key={accommodation.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{accommodation.name}</Typography>
                <Typography variant="body2">{accommodation.description}</Typography>
                
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
}

export default Accommodations;