import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Chip,
  Button,
  TableContainer,
  TablePagination,
  useTheme
} from '@mui/material';
import { FiEye, FiDownload } from 'react-icons/fi';

const Orders = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Sample data - replace with your actual data
  const orders = [
    {
      id: '#12345',
      date: '2024-02-20',
      total: '$299.99',
      status: 'Delivered',
      items: 3
    },
    {
      id: '#12346',
      date: '2024-02-19',
      total: '$199.99',
      status: 'Processing',
      items: 2
    },
    {
      id: '#12347',
      date: '2024-02-18',
      total: '$499.99',
      status: 'Shipped',
      items: 1
    },
    {
      id: '#12348',
      date: '2024-02-17',
      total: '$99.99',
      status: 'Cancelled',
      items: 1
    },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'success';
      case 'processing':
        return 'warning';
      case 'shipped':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      maxWidth: '1200px', 
      margin: '0 auto',
      minHeight: '100vh',
      bgcolor: '#f5f5f5'
    }}>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 4, 
          color: '#333',
          fontWeight: 600,
          fontFamily: 'Raleway'
        }}
      >
        My Orders
      </Typography>
      
      <Paper 
        sx={{ 
          overflow: 'hidden',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderRadius: '8px'
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f8f8' }}>
                <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Items</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order) => (
                <TableRow 
                  key={order.id}
                  sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}
                >
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.items} items</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>
                    <Chip 
                      label={order.status} 
                      color={getStatusColor(order.status)}
                      size="small"
                      sx={{ minWidth: '90px' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        startIcon={<FiEye />}
                        sx={{ 
                          minWidth: 'auto',
                          px: 1,
                          color: theme.palette.primary.main
                        }}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        startIcon={<FiDownload />}
                        sx={{ 
                          minWidth: 'auto',
                          px: 1,
                          color: theme.palette.primary.main
                        }}
                      >
                        Invoice
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default Orders; 