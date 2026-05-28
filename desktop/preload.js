const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Listen for CV data load events inside the hidden printing window
  onLoadCVData: (callback) => {
    const handler = (event, data) => callback(data);
    ipcRenderer.on('load-cv-data', handler);
    return () => {
      ipcRenderer.removeListener('load-cv-data', handler);
    };
  },
  
  // Launch high-fidelity PDF printing and native save file dialog
  generatePDF: (cvData) => ipcRenderer.invoke('generate-pdf', cvData)
});
