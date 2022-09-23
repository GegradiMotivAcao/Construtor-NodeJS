const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI',{
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  escreveElemento: () => ipcRenderer.send('escreveElemento'),
  escreveBackground: () => ipcRenderer.send('escreveBackground'),
  comando: () => ipcRenderer.send('Executacomando'),
  encontraUnity: () => ipcRenderer.send('LocalizaUnity'),
  encontraProjeto: () => ipcRenderer.send('LocalizaProjeto')
})

ipcRenderer.send('resize-window', 1280, 768)



