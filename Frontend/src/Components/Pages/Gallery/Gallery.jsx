import React, { useState } from 'react'
import { Box, Grid, Card, CardMedia, Container } from '@mui/material'
import GalleryImages from './GalleryImages'

const Gallery = () => {
    const [hoveredIndex, setHoveredIndex] = useState(0);

    return (
        <>
            <Box sx={{ padding: "50px 0", backgroundColor: "#f5f5f5", marginTop: "50px", marginBottom: "120px" }}>
                <Container>
                    <Grid container spacing={2}>
                        {GalleryImages.map((gallery) => {
                            return (
                                <>
<Grid item xs={12} md={3}>
  <Card 
  onMouseEnter={() => setHoveredIndex(gallery.id)}
  onMouseLeave={() => setHoveredIndex(null)}
  key={gallery.id}
  sx={{
      transition: "all 0.6s ease",
      boxShadow: hoveredIndex === gallery.id ? "0px 8px 30px rgba(20, 157, 221, 0.4)" : "0px 4px 15px rgba(20, 157, 221, 0.2)",
      maxWidth: 300, 
      margin: "0 auto", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center" 
    }} 
    >
    <CardMedia
      sx={{ 
        padding: "20px", 
        width: "100%", 
        boxSizing: "border-box" 
      }}
    >
      <img 
        src={gallery.image} 
        alt="" 
        style={{ 
          width: "100%", 
          height: "auto", 
          display: "block" ,
          borderRadius: "12px",
        }} 
      />
    </CardMedia>
  </Card>
</Grid>

                                </>
                            )
                        })}
                    </Grid>
                </Container>
            </Box>
        </>
    )
}

export default Gallery