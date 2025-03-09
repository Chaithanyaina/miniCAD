import React, { useState, useEffect } from "react";
import axios from "axios";
import ModelViewer from "./components/ModelViewer";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  CircularProgress,
  Paper,
  Grid,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  CssBaseline,
} from "@mui/material";
import { CloudUpload, Download, Brightness4, Brightness7 } from "@mui/icons-material";
import { styled } from "@mui/system";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// ✅ Set up a dynamic API URL for both development & production
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Themes
const lightTheme = createTheme({ palette: { mode: "light", primary: { main: "#1976d2" } } });
const darkTheme = createTheme({ palette: { mode: "dark", primary: { main: "#90caf9" } } });

// Styled Components
const FullWidthViewer = styled(Box)({
  width: "100%",
  height: "calc(100vh - 200px)",
  backgroundColor: "#eee",
  borderRadius: 8,
  overflow: "hidden",
});

const StyledDrawer = styled(Drawer)({
  width: 240,
  flexShrink: 0,
  "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" },
});

export default function App() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // ✅ Fetch models from backend
  const fetchModels = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/models`);
      setModels(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  // ✅ Handle file upload
  const handleUpload = async (selectedFile) => {
    if (!selectedFile) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("model", selectedFile);

      await axios.post(`${API_BASE_URL}/api/models`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchModels();
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle exporting model
  const handleExport = async () => {
    if (!models.length) return;

    try {
      window.open(`${API_BASE_URL}/api/models/export/${models[0]._id}`, "_blank");
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Mini CAD Viewer
            </Typography>
            <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <StyledDrawer variant="permanent">
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              <ListItemButton component="label">
                <ListItemIcon>
                  <CloudUpload />
                </ListItemIcon>
                <ListItemText primary="Upload" />
                <input
                  type="file"
                  accept=".stl,.obj"
                  hidden
                  onChange={(e) => handleUpload(e.target.files[0])}
                />
              </ListItemButton>
              <ListItemButton onClick={handleExport} disabled={!models.length}>
                <ListItemIcon>
                  <Download />
                </ListItemIcon>
                <ListItemText primary="Export" />
              </ListItemButton>
            </List>
          </Box>
        </StyledDrawer>

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              {loading ? (
                <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                  <CircularProgress />
                </Grid>
              ) : models.length > 0 ? (
                <Grid item xs={12}>
                  <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h5">Viewing: {models[0].originalname}</Typography>
                    <FullWidthViewer>
                      {models[0].cloudinaryUrl && (
                        <ModelViewer filePath={models[0].cloudinaryUrl} />
                      )}
                    </FullWidthViewer>
                  </Paper>
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <Typography variant="h6" textAlign="center">
                    No models uploaded yet
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
