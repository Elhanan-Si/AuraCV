const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('--dev');
let mainWindow = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false,
    title: 'AuraCV',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  mainWindow.setMenuBarVisibility(false);

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(`file://${path.join(__dirname, 'client/dist/index.html')}`);
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ----------------------------------------------------
// IPC Channel Handler: Generate PDF
// ----------------------------------------------------
ipcMain.handle('generate-pdf', async (event, cvData) => {
  if (!mainWindow) return false;

  console.log(`[IPC] Starting offline PDF generation for ${cvData.personalDetails.firstName || 'User'}`);

  // Create temporary hidden browser window to perform rendering off-screen
  const printWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  try {
    // Load the client index pointing to print routing mode
    if (isDev) {
      await printWindow.loadURL('http://localhost:5173/?print=true');
    } else {
      await printWindow.loadURL(`file://${path.join(__dirname, 'client/dist/index.html')}?print=true`);
    }

    // Pass CV state to the print window
    printWindow.webContents.send('load-cv-data', cvData);

    // Wait a brief period for the React state rendering cycle to settle
    let isReady = false;
    for (let i = 0; i < 20; i++) {
      isReady = await printWindow.webContents.executeJavaScript('window.cvDataReady === true').catch(() => false);
      if (isReady) break;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Safety buffer wait for fonts rendering
    await new Promise(resolve => setTimeout(resolve, 200));

    // Print window contents to A4 PDF using Chromium's built-in PDF generator
    const pdfBuffer = await printWindow.webContents.printToPDF({
      marginsType: 1, // No margins override, layouts handle their own margins
      pageSize: 'A4',
      printBackground: true,
      landscape: false
    });

    // Prompt user with native Windows "Save As" file save dialog
    const defaultName = `${cvData.personalDetails.firstName || 'AuraCV'}_${cvData.personalDetails.lastName || 'Resume'}.pdf`;
    const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
      title: cvData.settings.language === 'he' ? 'שמור קורות חיים כקובץ PDF' : 'Save Resume as PDF',
      defaultPath: path.join(app.getPath('downloads'), defaultName),
      filters: [
        { name: 'PDF Files', extensions: ['pdf'] }
      ]
    });

    if (canceled || !filePath) {
      console.log('[IPC] Save dialog was cancelled by the user.');
      return false;
    }

    // Write file directly to selected folder on disk offline
    fs.writeFileSync(filePath, pdfBuffer);
    console.log(`[IPC] PDF saved successfully to disk: ${filePath}`);
    return true;

  } catch (err) {
    console.error('[IPC] Failed to print document natively:', err);
    return false;
  } finally {
    // Make sure we clean up the off-screen window instance
    printWindow.close();
  }
});

// ----------------------------------------------------
// Electron App Lifecycle hooks
// ----------------------------------------------------
app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
