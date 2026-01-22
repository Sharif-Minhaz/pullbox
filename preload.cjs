const { contextBridge, ipcRenderer } = require('electron');

// =============== expose secure ipc api to renderer process ================
contextBridge.exposeInMainWorld('electronAPI', {
    // =============== check if url is a playlist ================
    checkPlaylist: (url) => ipcRenderer.invoke('ytdlp:check-playlist', url),

    // =============== fetch available formats for a given url ================
    fetchFormats: (url) => ipcRenderer.invoke('ytdlp:fetch-formats', url),

    // =============== start download with specified options ================
    download: (options) => ipcRenderer.invoke('ytdlp:download', options),

    // =============== open folder selection dialog ================
    selectFolder: () => ipcRenderer.invoke('dialog:select-folder'),

    // =============== listen for download progress updates ================
    onProgress: (callback) => {
        const subscription = (event, data) => callback(data);
        ipcRenderer.on('ytdlp:progress', subscription);

        // =============== return cleanup function ================
        return () => {
            ipcRenderer.removeListener('ytdlp:progress', subscription);
        };
    },

    // =============== listen for download errors ================
    onError: (callback) => {
        const subscription = (event, data) => callback(data);
        ipcRenderer.on('ytdlp:error', subscription);

        // =============== return cleanup function ================
        return () => {
            ipcRenderer.removeListener('ytdlp:error', subscription);
        };
    },
});
