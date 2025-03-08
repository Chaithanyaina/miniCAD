import { 
  useState, 
  useEffect 
} from 'react';
import axios from 'axios';
import { 
  Container, 
  Box, 
  Button, 
  CircularProgress,
  Typography,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import ModelViewer from './components/ModelViewer';
import './index.css';

function App() {
  const [file, setFile] = useState(null);
  const [models, setModels] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/models');
      setModels(res.data);
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };
  // Add to App.jsx
const handleExport = async (filename) => {
  try {
    const response = await axios.get(
      `/api/models/export/${filename}`, 
      { responseType: 'blob' }
    );
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}-converted.zip`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Export failed:', error);
  }
};

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('model', file);
      await axios.post('http://localhost:5000/api/models', formData);
      await fetchModels();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: 3,
        minHeight: '100vh'
      }}>
        <Typography variant="h3" component="h1" gutterBottom>
          <Box component="span" color="primary.main">CAD</Box> Viewer
        </Typography>

        <Card sx={{ width: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
              >
                Select STL File
                <input
                  type="file"
                  hidden
                  accept=".stl"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </Button>
              
              <Button
                variant="outlined"
                onClick={handleUpload}
                disabled={!file || uploading}
              >
                {uploading ? (
                  <CircularProgress size={24} />
                ) : (
                  'Upload Model'
                )}
              </Button>
            </Box>

            {file && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                Selected file: {file.name}
              </Typography>
            )}
          </CardContent>
        </Card>

        {models.length > 0 && (
          <Card sx={{ width: '100%', flexGrow: 1 }}>
            <CardContent sx={{ height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                Model Preview
              </Typography>
              <Box sx={{ 
                height: '70vh',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden'
              }}>
                <ModelViewer 
                  url={`http://localhost:5000/uploads/${models[0].filename}`} 
                />
              </Box>
              
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleExport(models[0].filename)}
                  >
                    Export as OBJ
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
}

export default App;
