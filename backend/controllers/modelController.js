const Model = require('../models/Model');
const THREE = require('three');
const { STLLoader } = require('three/examples/jsm/loaders/STLLoader');
const { OBJExporter } = require('three/examples/jsm/exporters/OBJExporter');
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

exports.exportModel = async (req, res) => {
  try {
    const model = await Model.findById(req.params.id);
    if (!model) return res.status(404).send('Model not found');

    const stlPath = path.join(__dirname, '../../uploads', model.filename);
    
    // Convert STL to OBJ
    const stlData = fs.readFileSync(stlPath);
    const loader = new STLLoader();
    const geometry = loader.parse(stlData);
    
    const mesh = new THREE.Mesh(geometry);
    const exporter = new OBJExporter();
    const objData = exporter.parse(mesh);

    // Create ZIP archive
    const zip = new JSZip();
    zip.file(`${model.originalname}.obj`, objData);
    
    // Generate ZIP buffer
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename=${model.originalname}-converted.zip`
    });
    
    res.send(zipBuffer);
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).send('Conversion failed');
  }
};
exports.uploadModel = async (req, res) => {
  const newModel = new Model({
    filename: req.file.filename,
    originalname: req.file.originalname,
  });
  await newModel.save();
  res.json(newModel);
};

exports.getModels = async (req, res) => {
  const models = await Model.find().sort('-createdAt');
  res.json(models);
};
