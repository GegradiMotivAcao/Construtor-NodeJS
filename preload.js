const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI',{
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  escreve: () => ipcRenderer.send('escreveArquivo'),
  comando: () => ipcRenderer.send('Executacomando')
})

ipcRenderer.send('resize-window', 1280, 768)



