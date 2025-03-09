# Mini CAD Viewer 🖥️🛠️

A lightweight 3D CAD viewer application that enables users to upload, visualize, and export 3D models (STL/OBJ format) with cloud storage integration.


## Features ✨
- **3D Model Visualization**: View STL/OBJ files with interactive controls
- **Cloud Storage**: Auto-save models to Cloudinary
- **Export Functionality**: One-click export to OBJ format
- **Responsive UI**: Dark/light theme support
- **Modern Stack**: Built with MERN stack + Three.js

## Tech Stack 🛠️

**Frontend**  
`React` · `Three.js` · `Material-UI` · `Axios`

**Backend**  
`Node.js` · `Express` · `MongoDB` · `Cloudinary`

**DevOps**  
`Vercel` · `Render` · `GitHub Actions`

## Installation ⚙️

### 1. Clone repo  
```bash
git clone https://github.com/Chaithanyaina/miniCAD

## Install dependencies ⚙️
cd backend && npm install  
cd ../frontend && npm install  
3. Configure environment variables
Create .env files in both backend and frontend directories:

Backend (.env)

PORT=5000  
MONGODB_URI=your_mongodb_uri  
CLOUDINARY_CLOUD_NAME=your_cloud_name  
CLOUDINARY_API_KEY=your_api_key  
CLOUDINARY_API_SECRET=your_api_secret  
