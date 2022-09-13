const {app, BrowserWindow, ipcMain, dialog} = require('electron')
const path = require('path')
const fs = require('fs');

let enderecos = [];


async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (canceled) {
    return
  } else {
    enderecos.push(filePaths[0]);
    return filePaths[0]
  }
}

ipcMain.on('escreveArquivo', () => {
  //let content = "Gabiru e Perdigão VS Barça do Ronaldo";
    console.log("clicou");
    enderecos.forEach(element => {
      fs.appendFile('./js/teste.txt', element + "\n", function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
    });

    /*fs.writeFile("./js/teste.txt", content, (err) => {
      if(err){
        console.log("An error ocurred creating the file "+ err.message)
          return
      }
                  
      console.log("The file has been succesfully saved");
      return "funcionou"
  });*/
})


function createWindow () {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }, resizable: false
  })
  mainWindow.loadFile('views/const-background.html')
}

ipcMain.on('resize-window', (event, width, height) => {
    let browserWindow = BrowserWindow.fromWebContents(event.sender)
    browserWindow.setSize(width,height)
})


app.whenReady().then(() => {
  ipcMain.handle('dialog:openFile', handleFileOpen)
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})