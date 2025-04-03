import { Box, Card, CardContent, CardMedia, Container, Grid, Typography, Dialog, DialogContent, IconButton, Button, Rating, TextField, Divider, Avatar, Stack, Fade } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Portfolio() {
  const [value, setValue] = useState('1');
  const [projects, setProjects] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleBookClick = async (book) => {
    setSelectedBook(book);
    await fetchBookReviews(book._id);
  };

  const handleCloseProjectModal = () => {
    setSelectedProject(null);
  };

  const handleCloseBookModal = () => {
    setSelectedBook(null);
    setQuantity(1);
    setReviews([]);
    setNewReview({ rating: 0, comment: '' });
  };

  const handleQuantityChange = (event) => {
    const value = Math.max(1, Math.min(selectedBook.countInStock, Number(event.target.value)));
    setQuantity(value);
  };

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', { book: selectedBook, quantity });
    handleCloseBookModal();
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/v1/portfolio");
      setProjects(response.data || []);
    } catch (error) {
      console.log("Error fetching projects:", error);
      toast.error("Failed to load projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/v1/books");
      setBooks(response.data || []);
    } catch (error) {
      console.log("Error fetching books:", error);
      toast.error("Failed to load books. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookReviews = async (bookId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/books/${bookId}/reviews`);
      setReviews(response.data || []);
    } catch (error) {
      console.log("Error fetching reviews:", error);
      toast.error("Failed to load reviews. Please try again later.");
    }
  };

  const handleAddReview = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please login to add a review");
        return;
      }

      if (!newReview.rating || !newReview.comment) {
        toast.error("Please provide both a rating and a comment");
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/v1/books/${selectedBook._id}/reviews`,
        newReview,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        // Update the book's average rating
        const updatedBook = { ...selectedBook };
        const newReviews = [...reviews, response.data];
        const totalRating = newReviews.reduce((sum, review) => sum + review.rating, 0);
        updatedBook.averageRating = totalRating / newReviews.length;
        setSelectedBook(updatedBook);

        // Update reviews list
        setReviews(newReviews);
        setNewReview({ rating: 0, comment: '' });
        toast.success("Review added successfully!");
      }
    } catch (error) {
      console.log("Error adding review:", error);
      const errorMessage = error.response?.data?.message || "Failed to add review. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please login to delete your review");
        return;
      }

      await axios.delete(
        `http://localhost:5000/api/v1/books/${selectedBook._id}/reviews/${reviewId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Update the book's average rating
      const updatedBook = { ...selectedBook };
      const newReviews = reviews.filter(review => review._id !== reviewId);
      const totalRating = newReviews.reduce((sum, review) => sum + review.rating, 0);
      updatedBook.averageRating = newReviews.length > 0 ? totalRating / newReviews.length : 0;
      setSelectedBook(updatedBook);

      // Update reviews list
      setReviews(newReviews);
      toast.success("Review deleted successfully!");
    } catch (error) {
      console.log("Error deleting review:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete review. Please try again.";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchBooks();
  }, []);

  return (
    <Box
      id="portfolio"
      sx={{
        bgcolor: "#F4FAFD",
        position: "relative",
        padding: { xs: "60px 0", md: "80px 0" },
        overflow: "hidden",
      }}
    >
      <Container>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            position: "relative",
            fontFamily: "Raleway",
            fontWeight: "600",
            mb: { xs: "80px", md: "50px" },
            fontSize: { xs: "2rem", md: "2.5rem" },
            "&::after": {
              content: '""',
              position: "absolute",
              width: { xs: "80px", md: "120px" },
              height: "3px",
              backgroundColor: "#149ddd",
              bottom: "-10px",
              left: { xs: "45px", md: "5.5%" },
              transform: "translateX(-50%)",
            },
          }}
          data-aos="fade-down"
        >Portfolio</Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <Typography>Loading...</Typography>
          </Box>
        ) : (
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList 
                onChange={handleChange} 
                sx={{ 
                  textAlign: 'center', 
                  ml: {xs:'20%', md:'35%'}, 
                  mr: {xs:'10%', md:'35%' },
                  '& .MuiTabs-indicator': {
                    transition: 'all 0.6s ease'
                  },
                  '& .MuiTab-root': {
                    transition: 'all 0.6s ease',
                    '&.Mui-selected': {
                      transform: 'scale(1.05)'
                    }
                  }
                }}
              >
                <Tab label="Projects" value="1" />
                <Tab label="Books" value="2" />
              </TabList>
            </Box>
            <TabPanel 
              value="1" 
              sx={{ 
                p: 0,
                opacity: value === '1' ? 1 : 0,
                transition: 'opacity 0.6s ease',
                mt: 2
              }}
            >
              <Grid container spacing={2}>
                {projects.map((project, index) => (
                  <Grid item xs={12} sm={6} md={4} key={project._id}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  >
                    <Card
                      sx={{
                        cursor: 'pointer',
                        minHeight: '250px',
                        width: '350px',
                        position: 'relative',
                        boxShadow: "rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px",
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px"
                        },
                        '&:hover .overlay': {
                          opacity: 1
                        },
                        transition: 'all 0.6s ease'
                      }}
                      onClick={() => handleProjectClick(project)}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={project.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                        alt={project.title}
                        sx={{
                          objectFit: 'cover',
                          width: '100%',
                          height: '250px',
                          objectPosition: 'center'
                        }}
                      />
                      <Box
                        className="overlay"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          bgcolor: 'rgba(0, 0, 0, 0.5)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          transition: 'opacity 0.2s',
                          color: 'white',
                          textAlign: 'center',
                          p: 2
                        }}
                      >
                        <ZoomInIcon sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="subtitle1">Click to View Details</Typography>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
            <TabPanel 
              value="2" 
              sx={{ 
                p: 0,
                opacity: value === '2' ? 1 : 0,
                transition: 'opacity 0.3s ease',
                mt: 2
              }}
            >
              <Grid container spacing={2}>
                {books.map((book, index) => (
                  <Grid item xs={12} sm={6} md={4} key={book._id}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  >
                    <Card
                      sx={{
                        cursor: 'pointer',
                        minHeight: '250px',
                        width: '350px',
                        position: 'relative',
                        boxShadow: "rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px",
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px"
                        },
                        '&:hover .overlay': {
                          opacity: 1
                        },
                        transition: 'all 0.6s ease'
                      }}
                      onClick={() => handleBookClick(book)}
                    >
                      <CardMedia
                        component="img"
                        height="250"
                        image={book.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                        alt={book.title}
                        sx={{
                          objectFit: 'cover',
                          width: '100%',
                          height: '250px',
                          objectPosition: 'center'
                        }}
                      />
                      <Box
                        className="overlay"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          bgcolor: 'rgba(0, 0, 0, 0.5)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          transition: 'opacity 0.2s',
                          color: 'white',
                          textAlign: 'center',
                          p: 2
                        }}
                      >
                        <ZoomInIcon sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="subtitle1">Click to View Details</Typography>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
          </TabContext>
        )}
      </Container>

      {/* Project Modal */}
      <Dialog
        open={!!selectedProject}
        onClose={handleCloseProjectModal}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <IconButton
            onClick={handleCloseProjectModal}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
          {selectedProject && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  style={{ width: '100%', height: 'auto' }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h4" gutterBottom fontFamily="Raleway" fontWeight="600" textAlign={"center"}>{selectedProject.title}</Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom fontFamily="Raleway" fontWeight="600">
                  Category: {selectedProject.category}
                </Typography>
                <Typography variant="p" component="h6" fontFamily="Raleway" paragraph>
                  Description: <br />
                  <span style={{ marginLeft: "10px", fontStyle: "italic" }}>
                    <b>" </b>{selectedProject.description}<b> "</b>
                  </span>
                </Typography>
                <Typography variant="subtitle1" gutterBottom fontFamily="Raleway" fontWeight="600" fontStyle={"italic"}>Skills Used:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedProject.skillsUsed.map((skill, index) => (
                    <Typography
                      key={index}
                      sx={{
                        bgcolor: '#e3f2fd',
                        px: 2,
                        py: 1,
                        borderRadius: 1,
                        fontFamily: "Raleway",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        fontWeight: "600",
                        "&:hover": {
                          bgcolor: "#292F37",
                          color: "#e3f2fd"
                        }
                      }}
                    >
                      {skill}
                    </Typography>
                  ))}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      {/* Book Modal */}
      <Dialog
        open={!!selectedBook}
        onClose={handleCloseBookModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '90vh',
            overflow: 'hidden',
            '@media (max-width: 600px)': {
              maxHeight: '100vh',
              margin: 0,
              borderRadius: 0
            }
          }
        }}
      >
        <DialogContent sx={{ p: 0, height: '90vh', overflow: 'hidden' }}>
          <IconButton
            onClick={handleCloseBookModal}
            sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}
          >
            <CloseIcon />
          </IconButton>
          {selectedBook && (
            <Grid container sx={{ height: '100%' }}>
              <Grid item xs={12} md={6} sx={{ 
                height: '100%',
                position: 'sticky',
                top: 0,
                bgcolor: 'background.paper',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <Box sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 2
                }}>
                  <CardMedia
                    component="img"
                    image={selectedBook.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                    alt={selectedBook.title}
                    sx={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6} sx={{ 
                height: '100%',
                overflowY: 'auto',
                p: 3,
                '@media (max-width: 600px)': {
                  p: 2,
                  height: 'calc(100% - 40vh)'
                }
              }}>
                <Typography variant="h4" gutterBottom fontFamily="Raleway" fontWeight="600">
                  {selectedBook.title}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom fontFamily="Raleway" fontWeight="600" >
                  by {selectedBook.author}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating 
                    value={selectedBook.averageRating} 
                    readOnly 
                    precision={0.5}
                    sx={{ color: '#FFD700' }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }} fontFamily="Raleway" fontWeight="600">
                    ({reviews.length} reviews)
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph fontFamily="Raleway" fontWeight="600">
                  {selectedBook.description}
                </Typography>
                <Typography variant="h5" color="primary" gutterBottom fontFamily="Raleway" fontWeight="600">
                  Rs.{selectedBook.price}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TextField
                    type="number"
                    label="Quantity"
                    value={quantity}
                    onChange={handleQuantityChange}
                    inputProps={{ min: 1, max: selectedBook.countInStock }}
                    sx={{ width: '100px', mr: 2 }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<ShoppingCartIcon />}
                    onClick={handleAddToCart}
                    disabled={selectedBook.countInStock === 0}
                  >
                    Add to Cart
                  </Button>
                </Box>

                {/* Reviews Section */}
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Reviews
                </Typography>

                {/* Add Review Form */}
                <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Add a Review
                  </Typography>
                  <Rating
                    value={newReview.rating}
                    onChange={(event, newValue) => {
                      setNewReview({ ...newReview, rating: newValue });
                    }}
                    sx={{ mb: 2, color: '#FFD700' }}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Your Review"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddReview}
                    disabled={!newReview.rating || !newReview.comment}
                  >
                    Submit Review
                  </Button>
                </Box>

                {/* Reviews List */}
                <Stack spacing={2}>
                  {reviews.map((review) => (
                    <Box key={review._id} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar src={review.user?.profilePicture} sx={{ mr: 1 }} />
                          <Box>
                            <Typography variant="subtitle1">
                              {review.user?.name || 'Anonymous'}
                            </Typography>
                            <Rating value={review.rating} readOnly size="small" sx={{ color: '#FFD700' }} />
                          </Box>
                        </Box>
                        {review.user?._id === localStorage.getItem('userId') && (
                          <IconButton 
                            onClick={() => handleDeleteReview(review._id)}
                            sx={{ color: 'error.main' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {review.comment}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};
