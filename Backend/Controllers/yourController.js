const uploadImage = async (req, res) => {
  try {
    const imageUrl = `${process.env.BASE_URL}/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
}; 