import { Box, Card, CardContent, CardMedia, Container, Grid, Typography, Dialog, DialogContent, IconButton, Button, Rating, TextField, Divider, Avatar, Stack, Fade, Pagination, Link, Chip } from '@mui/material'
import React, { useEffect, useState, useMemo, memo, useCallback } from 'react'
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
import { useCart } from '../../../context/CartContext';
import { resolveImageUrl } from '../../../utils/imageUtils';
import * as reviewService from '../../../services/reviewService';

// Memoized Card Components
const ProjectCard = memo(({ project, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(project);
  }, [onClick, project]);

  
  return (
    <Card
      sx={{
        cursor: 'pointer',
        minHeight: '250px',
        width: '350px',
        position: 'relative',
        boxShadow: "rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px",
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px"
        },
        '&:hover .overlay': {
          opacity: 1
        },
        transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out'
      }}
      onClick={handleClick}
    >
      <CardMedia
        component="img"
        height="200"
        image={resolveImageUrl(project.image) || '/images/placeholder.jpg'}
        alt={project.title}
        sx={{
          objectFit: 'cover',
          width: '100%',
          height: '250px',
          objectPosition: 'center'
        }}
        loading="lazy"
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
          color: 'white',
          textAlign: 'center',
          p: 2
        }}
      >
        <ZoomInIcon sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="subtitle1">Click to View Details</Typography>
      </Box>
    </Card>
  );
});

ProjectCard.displayName = 'ProjectCard';

const BookCard = memo(({ book, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(book);
  }, [onClick, book]);
  const getEffectiveDiscount = () => {
    const bulkDiscount = selectedBook.bulkDiscounts
      ?.filter((bd) => quantity >= bd.quantity)
      .sort((a, b) => b.quantity - a.quantity)[0];
  
    return bulkDiscount?.discount || selectedBook.discount || 0;
  };
  
  const getDiscountedPrice = () => {
    const discount = getEffectiveDiscount();
    return selectedBook.price - (selectedBook.price * discount) / 100;
  };
  
  return (
    <Card
      sx={{
        cursor: 'pointer',
        minHeight: '250px',
        width: '350px',
        position: 'relative',
        boxShadow: "rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px",
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px"
        },
        '&:hover .overlay': {
          opacity: 1
        },
        transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out'
      }}
      onClick={handleClick}
    >
      <CardMedia
        component="img"
        height="140"
        image={resolveImageUrl(book.coverImage)}
        alt={book.title}
        sx={{
          objectFit: 'cover',
          width: '100%',
          height: '200px'
        }}
      />
      <CardContent>
        <Typography variant="h6" noWrap>
          {book.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          by {book.author}
        </Typography>
      </CardContent>
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
          color: 'white',
          textAlign: 'center',
          p: 2
        }}
      >
        <ZoomInIcon sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="subtitle1">Click to View Details</Typography>
      </Box>
    </Card>
  );
});

BookCard.displayName = 'BookCard';

// Pagination component
const PaginatedGrid = memo(({ items, renderItem, itemsPerPage = 6 }) => {
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const paginatedItems = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  }, [items, page, itemsPerPage]);

  const renderGridItem = useCallback((item, index) => (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      key={item._id || index}
      data-aos="fade-up"
      data-aos-delay={Math.min(index * 50, 200)}
      data-aos-once="true"
    >
      {renderItem(item)}
    </Grid>
  ), [renderItem]);

  return (
    <>
      <Grid container spacing={2}>
        {paginatedItems.map(renderGridItem)}
      </Grid>

      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </>
  );
});

PaginatedGrid.displayName = 'PaginatedGrid';

const Portfolio = React.memo(function Portfolio() {
  const [value, setValue] = useState(() => {
    const savedTab = localStorage.getItem('selectedTab');
    if (savedTab) {
      localStorage.removeItem('selectedTab'); // Clear it after reading
      return savedTab;
    }
    return '1';
  });
  const [projects, setProjects] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const { addToCart } = useCart();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const handleChange = useCallback((event, newValue) => {
    setValue(newValue);
  }, []);

  const handleProjectClick = useCallback((project) => {
    setSelectedProject(project);
    setOpen(true);
  }, []);

  const handleBookClick = useCallback(async (book) => {
    setSelectedBook(book);
    await fetchBookReviews(book._id);
  }, []);

  const handleCloseProjectModal = useCallback(() => {
    setSelectedProject(null);
    setOpen(false);
  }, []);

  const handleCloseBookModal = useCallback(() => {
    setSelectedBook(null);
    setQuantity(1);
    setReviews([]);
    setNewReview({ rating: 0, comment: '' });
  }, []);

  const handleQuantityChange = useCallback((event) => {
    const value = Math.max(1, Math.min(selectedBook?.countInStock || 1, Number(event.target.value)));
    setQuantity(value);
  }, [selectedBook]);

  const handleAddToCart = useCallback(() => {
    addToCart(selectedBook, quantity);
    handleCloseBookModal();
  }, [addToCart, selectedBook, quantity, handleCloseBookModal]);

  const fetchProjects = useCallback(async () => {
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
  }, []);

  const fetchBooks = useCallback(async () => {
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
  }, []);

  const fetchBookReviews = useCallback(async (bookId) => {
    try {
      const response = await reviewService.getBookReviews(bookId);
      setReviews(response || []);
    } catch (error) {
      console.log("Error fetching reviews:", error);
      toast.error("Failed to load reviews. Please try again later.");
    }
  }, []);

  const handleAddReview = useCallback(async () => {
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

      const response = await reviewService.createBookReview(selectedBook._id, {
        rating: newReview.rating,
        comment: newReview.comment
      });

      if (response) {
        // Update the book's average rating
        const updatedBook = { ...selectedBook };
        const newReviews = [...reviews, response];
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
      const errorMessage = error.message || "Failed to add review. Please try again.";
      toast.error(errorMessage);
    }
  }, [selectedBook, newReview, reviews]);

  const handleDeleteReview = useCallback(async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please login to delete your review");
        return;
      }

      await reviewService.deleteBookReview(selectedBook._id, reviewId);

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
      const errorMessage = error.message || "Failed to delete review. Please try again.";
      toast.error(errorMessage);
    }
  }, [selectedBook, reviews]);

  const items = useMemo(() => {
    if (value === '1') {
      return Array.isArray(projects) ? projects : [];
    } else {
      return Array.isArray(books) ? books : [];
    }
  }, [value, projects, books]);

  const pageCount = Math.ceil(items.length / itemsPerPage);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const paginatedItems = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  }, [items, page, itemsPerPage]);

  useEffect(() => {
    fetchProjects();
    fetchBooks();
  }, [fetchProjects, fetchBooks]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:5000/api/v1/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          setUser(response.data);
        })
        .catch(error => {
          console.log("Error fetching user:", error);
          toast.error("Failed to load user information. Please try again later.");
        });
    }
  }, []);

  return (
    <Box
      id="portfolio"
      sx={{
        bgcolor: "#F4FAFD",
        position: "relative",
        padding: { xs: "20px 0", md: "30px 0" },
        overflow: "hidden",
      }}
    >
      <Container>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            position: "relative",
            fontWeight: "600",
            mt: 0,
            mb: { xs: "20px", md: "25px" },
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
                  ml: { xs: '20%', md: '35%' },
                  mr: { xs: '10%', md: '35%' }
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
                mt: 2,
                display: 'block'
              }}
            >
              <Grid container spacing={2}>
                {paginatedItems.map((project) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={project._id}
                    data-aos="fade-up"
                    data-aos-delay={Math.min(project.index * 50, 200)}
                    data-aos-once="true"
                  >
                    <ProjectCard project={project} onClick={handleProjectClick} />
                  </Grid>
                ))}
              </Grid>
              {pageCount > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={pageCount}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </TabPanel>
            <TabPanel
              value="2"
              sx={{
                p: 0,
                mt: 2,
                display: 'block'
              }}
            >
              <Grid container spacing={2}>
                {paginatedItems.map((book) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={book._id}
                    data-aos="fade-up"
                    data-aos-delay={Math.min(book.index * 50, 200)}
                    data-aos-once="true"
                  >
                    <BookCard book={book} onClick={handleBookClick} />
                  </Grid>
                ))}
              </Grid>
              {pageCount > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={pageCount}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </TabPanel>
          </TabContext>
        )}
      </Container>

      {/* Project Modal */}
      <Dialog
        open={open}
        onClose={handleCloseProjectModal}
        maxWidth="md"
        fullWidth
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 400 }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: 'linear-gradient(145deg, #1e242c 0%, #171b21 100%)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            overflow: 'hidden',
            '& *': {
              overflow: 'hidden !important'
            }
          }
        }}
      >
        {selectedProject && (
          <DialogContent sx={{ p: 0, position: 'relative', bgcolor: 'transparent' }}>
            <IconButton
              onClick={handleCloseProjectModal}
              sx={{
                position: 'absolute',
                right: 16,
                top: 16,
                color: 'white',
                zIndex: 1,
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'rotate(90deg)',
                },
                transition: 'all 0.3s ease-in-out'
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
              <Box
                component="img"
                src={resolveImageUrl(selectedProject.image) || '/images/placeholder.jpg'}
                alt={selectedProject.title}
                sx={{
                  width: { xs: '100%', md: '50%' },
                  height: { xs: '300px', md: 'auto' },
                  objectFit: 'contain',
                  padding: '20px',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}
              />
              <Box
                sx={{
                  p: 4,
                  flex: 1,
                  color: 'white',
                  background: 'rgba(255, 255, 255, 0.02)'
                }}
              >
                <Typography
                  variant="h4"
                  component="h2"
                  gutterBottom
                  sx={{
                    // color: 'linear-gradient(50deg, #149DDD 80%, #A2EEFD 80%);',
                    fontWeight: 600,
                    background: 'linear-gradient(160deg, #149DDD 30%, #A2EEFD 60%);',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2
                  }}
                >
                  {selectedProject.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: 1.7,
                    mb: 1
                  }}
                >
                  {selectedProject.description}
                </Typography>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 500,
                    background: 'linear-gradient(120deg, #149DDD 0%, #A2EEFD 60%);',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                  }}
                >
                  Category
                </Typography>
                <Box
                  sx={{
                    bgcolor: 'rgba(20, 157, 221, 0.1)',
                    color: '#fff',
                    px: 2,
                    py: 0.75,
                    borderRadius: 2,
                    fontSize: '0.875rem',
                    border: '1px solid rgba(20, 157, 221, 0.2)',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      bgcolor: 'rgba(20, 157, 221, 0.2)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  {selectedProject.category}
                </Box>
                {selectedProject.skillsUsed && (
                  <Box sx={{ mt: 1 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        color: 'white',
                        fontWeight: 500,
                        background: 'linear-gradient(120deg, #149DDD 0%, #A2EEFD 60%);',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1
                      }}
                    >
                      Tools Used
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedProject.skillsUsed.map((tech, index) => (
                        <Box
                          key={index}
                          sx={{
                            bgcolor: 'rgba(20, 157, 221, 0.1)',
                            color: '#fff',
                            px: 2,
                            py: 0.75,
                            borderRadius: 2,
                            fontSize: '0.875rem',
                            border: '1px solid rgba(20, 157, 221, 0.2)',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              bgcolor: 'rgba(20, 157, 221, 0.2)',
                              transform: 'translateY(-2px)'
                            }
                          }}
                        >
                          {tech}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </DialogContent>
        )}
      </Dialog>

      {/* Book Modal */}
      <Dialog
  open={Boolean(selectedBook)}
  onClose={handleCloseBookModal}
  maxWidth="md"
  fullWidth
  TransitionComponent={Fade}
  TransitionProps={{ timeout: 400 }}
>
  {selectedBook && (
    <DialogContent sx={{ p: 0, position: 'relative' }}>
      <IconButton
        onClick={handleCloseBookModal}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: 'grey.500',
          zIndex: 1,
          bgcolor: 'white',
          '&:hover': {
            bgcolor: 'grey.200',
          },
        }}
      >
        <CloseIcon />
      </IconButton>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Box
          component="img"
          src={resolveImageUrl(selectedBook.coverImage)}
          alt={selectedBook.title}
          sx={{
            width: { xs: '100%', md: '40%' },
            height: { xs: '300px', md: 'auto' },
            objectFit: 'cover',
          }}
        />
        <Box sx={{ p: 3, flex: 1 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {selectedBook.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {selectedBook.description}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={selectedBook.averageRating || 0} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({selectedBook.averageRating ? selectedBook.averageRating.toFixed(1) : '0'} / 5)
            </Typography>
          </Box>

          {/* Price with bulk discount */}
          <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
            {(() => {
              const price = selectedBook.price;
              const discount = selectedBook.discount;
              const bulkDiscount = selectedBook.bulkDiscount || 0;
              const isBulk = quantity >= 6;
              const finalDiscount = isBulk ? bulkDiscount : discount;
              const discountedPrice = price - (price * finalDiscount) / 100;

              return finalDiscount > 0 ? (
                <>
                  <span style={{ textDecoration: 'line-through', color: 'gray', marginRight: '8px' }}>
                    Rs. {price}
                  </span>
                  Rs. {discountedPrice.toFixed(2)}
                  <span style={{ color: 'red', marginLeft: '8px' }}>
                    ({finalDiscount}% off{isBulk ? ' - Bulk Discount' : ''})
                  </span>
                </>
              ) : (
                `Rs. ${price}`
              );
            })()}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Quantity:
            </Typography>
            <TextField
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              inputProps={{ min: 1, max: selectedBook.countInStock }}
              sx={{ width: '80px' }}
              size="small"
            />
          </Box>

          <Button
            variant="contained"
            startIcon={<ShoppingCartIcon />}
            onClick={handleAddToCart}
            disabled={selectedBook.countInStock <= 0}
            sx={{ mb: 2 }}
          >
            Add to Cart
          </Button>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Reviews
          </Typography>
          {reviews.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No reviews yet. Be the first to review this book!
            </Typography>
          ) : (
            <Stack spacing={2}>
              {reviews.map((review) => (
                <Box key={review._id} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar src={review.userId?.profilePic} alt={review.userId?.name} sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="subtitle2">{review.userId?.name || 'Anonymous'}</Typography>
                        <Rating value={review.rating} size="small" readOnly />
                      </Box>
                    </Box>
                    {user && (user._id === review.userId?._id || user.role === 'admin') && (
                      <IconButton
                        onClick={() => handleDeleteReview(review._id)}
                        size="small"
                        sx={{ color: 'error.main' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                  <Typography variant="body2">{review.comment}</Typography>
                </Box>
              ))}
            </Stack>
          )}

          <Divider sx={{ my: 2 }} />
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Add a Review
            </Typography>
            <Rating
              value={newReview.rating}
              onChange={(_, value) => setNewReview((prev) => ({ ...prev, rating: value }))}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              value={newReview.comment}
              onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
              placeholder="Write your review here..."
              sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={handleAddReview}>
              Submit Review
            </Button>
          </Box>
        </Box>
      </Box>
    </DialogContent>
  )}
</Dialog>

    </Box>
  );
});

export default Portfolio;
