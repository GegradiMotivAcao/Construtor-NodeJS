const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI',{
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  escreve: () => ipcRenderer.send('escreveArquivo')
})

ipcRenderer.send('resize-window', 1280, 768)

ipcRenderer.send('escreveArquivo')


