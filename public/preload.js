const { ipcRenderer, contextBridge } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.on('redirect-login', (_event, value) => {
        window.location = '/Login';
    })
})
contextBridge.exposeInMainWorld('api', {

    Action: (args) => ipcRenderer.invoke('action', args),
    MODO_APLICACAO: () => ipcRenderer.invoke('MODO_APLICACAO'),
    Alert: (args) => ipcRenderer.invoke('alert', args),
    maximize: () => ipcRenderer.invoke('maximize'),
    unmaximize: () => ipcRenderer.invoke('unmaximize'),

});
