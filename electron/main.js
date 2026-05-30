const { app, BrowserWindow } = require('electron');
const path = require('path');
const http = require('http');

let mainWindow;

function checkServerReady(url, callback) {
  http.get(url, (res) => {
    if (res.statusCode === 200) {
      callback();
    } else {
      setTimeout(() => checkServerReady(url, callback), 1000);
    }
  }).on('error', () => {
    setTimeout(() => checkServerReady(url, callback), 1000);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Krezona Engineering Desktop Application',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // URL of Next.js frontend
  const startUrl = 'http://localhost:3000';

  console.log('Waiting for Next.js server to start on http://localhost:3000...');
  checkServerReady(startUrl, () => {
    console.log('Next.js server is ready! Loading window...');
    mainWindow.loadURL(startUrl);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
