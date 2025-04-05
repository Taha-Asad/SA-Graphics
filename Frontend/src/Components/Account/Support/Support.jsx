import React from 'react';
import { Box, Typography, Paper, TextField, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

const Support = () => {
  const faqs = [
    {
      question: 'How do I track my order?',
      answer: 'You can track your order by going to the Track Order page and entering your order number.',
    },
    // Add more FAQs as needed
  ];

  return (
    <Box sx={{ p: 4, maxWidth: '800px', margin: '0 auto' }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#333' }}>
        Customer Support
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Contact Us
        </Typography>
        
        <Box sx={{ display: 'grid', gap: 3 }}>
          <TextField
            label="Subject"
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Message"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
          />
          <Button variant="contained">
            Send Message
          </Button>
        </Box>
      </Paper>
      
      <Typography variant="h6" sx={{ mb: 2 }}>
        Frequently Asked Questions
      </Typography>
      
      {faqs.map((faq, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{faq.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{faq.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default Support; 