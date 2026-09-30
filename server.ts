import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isDev = process.env.NODE_ENV !== 'production';

  // Increase payload limit for PDF/DOCX file uploads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  const linkFile = path.resolve(__dirname, 'dissertation_link.json');
  const uploadDir = path.resolve(__dirname, 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Serve uploaded files
  app.use('/uploads', express.static(uploadDir));

  // API endpoint to save dissertation link and metadata
  app.post('/api/dissertation-link', (req, res) => {
    try {
      const { url, title, notes } = req.body;
      const data = {
        url: url || '',
        title: title || '',
        notes: notes || '',
        updatedAt: new Date().toISOString(),
      };
      fs.writeFileSync(linkFile, JSON.stringify(data, null, 2), 'utf-8');
      console.log('Saved dissertation link:', data);
      res.json({ success: true, data });
    } catch (err) {
      console.error('Error saving dissertation link:', err);
      res.status(500).json({ error: 'Failed to save dissertation link' });
    }
  });

  // API endpoint to retrieve dissertation link
  app.get('/api/dissertation-link', (_req, res) => {
    try {
      if (fs.existsSync(linkFile)) {
        const content = fs.readFileSync(linkFile, 'utf-8');
        res.json(JSON.parse(content));
      } else {
        res.json({ url: '' });
      }
    } catch {
      res.json({ url: '' });
    }
  });

  // API endpoint to upload dissertation file (PDF, DOCX, DOC, TXT)
  app.post('/api/upload-dissertation', (req, res) => {
    try {
      const { fileName, fileType, base64Data, textContent, title } = req.body;
      if (!fileName || (!base64Data && !textContent)) {
        res.status(400).json({ error: 'Missing file data' });
        return;
      }

      const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
      const targetPath = path.join(uploadDir, safeFileName);

      if (base64Data) {
        // Strip data: prefix if present
        const base64Clean = base64Data.replace(/^data:[^;]+;base64,/, '');
        const buffer = Buffer.from(base64Clean, 'base64');
        fs.writeFileSync(targetPath, buffer);
      } else if (textContent) {
        fs.writeFileSync(targetPath, textContent, 'utf-8');
      }

      // Also save extracted text if available
      if (textContent) {
        fs.writeFileSync(path.join(uploadDir, `${safeFileName}.txt`), textContent, 'utf-8');
      }

      const meta = {
        fileName: safeFileName,
        originalName: fileName,
        fileType: fileType || 'application/pdf',
        fileUrl: `/uploads/${safeFileName}`,
        title: title || fileName.replace(/\.[^/.]+$/, ''),
        uploadedAt: new Date().toISOString(),
        hasText: !!textContent,
      };

      fs.writeFileSync(path.resolve(__dirname, 'uploaded_dissertation.json'), JSON.stringify(meta, null, 2));

      // Also update linkFile
      const linkData = {
        url: `/uploads/${safeFileName}`,
        title: meta.title,
        isUploadedFile: true,
        fileName: safeFileName,
        updatedAt: meta.uploadedAt,
      };
      fs.writeFileSync(linkFile, JSON.stringify(linkData, null, 2));

      console.log('Saved uploaded dissertation:', meta);
      res.json({ success: true, meta });
    } catch (err) {
      console.error('Error uploading dissertation:', err);
      res.status(500).json({ error: 'Failed to process file upload' });
    }
  });

  // Retrieve uploaded dissertation info
  app.get('/api/uploaded-dissertation', (_req, res) => {
    const metaPath = path.resolve(__dirname, 'uploaded_dissertation.json');
    if (fs.existsSync(metaPath)) {
      try {
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
        res.json(meta);
        return;
      } catch {
        // ignore
      }
    }
    res.json({ fileUrl: '' });
  });

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
