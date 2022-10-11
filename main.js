const {app, BrowserWindow, ipcMain, dialog} = require('electron')
const { exec } = require("child_process"); //permite executar linha no cmd/terminal
const path = require('path')
const fs = require('fs');

let enderecos = [];
let enderecoSelect= {};
let Unity="";
let Projeto="";

//FUNÇÃO QUE ABRE O DIALOG DE SELECIONAR ARQUIVOS
async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (canceled) {
    return
  } else {
  console.log("func dialog: " + filePaths[0])
    return filePaths[0]
  }
}

//FUNÇÃO QUE ABRE O DIALOG DE SELECIONAR PASTAS
async function handleFolderOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory'] })
  if (canceled) {
    return
  } else {
  console.log("func dialog: " + filePaths[0])
    return filePaths[0]
  }
}

//escreve caminho do Background no arquivo
ipcMain.on('escreveBackground', async () => {
  const pathdoarq = await handleFileOpen();
  nomeArq = path.basename(pathdoarq);
  //copia a imagem para o \resources do projeto unity
  exec( 'copy '+ '"' + pathdoarq +'" '+ '"' + Projeto + '\\Assets\\Resources"', (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    fs.appendFile(Projeto + '\\Assets\\Resources\\lista.txt', nomeArq + ";0\n", function (err) {
      if (err) throw err;
      console.log('BG Salvo!');
    });
});

})

//escreve caminhos de Elementos no arquivo
ipcMain.on('escreveElemento', async () => {
  const pathdoarq = await handleFileOpen();
  nomeArq = path.basename(pathdoarq);

  exec( 'copy '+ '"' + pathdoarq +'" '+ '"' + Projeto + '\\Assets\\Resources"', (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    fs.appendFile(Projeto + '\\Assets\\Resources\\lista.txt', nomeArq + ";1\n", function (err) {
      if (err) throw err;
      console.log('Elemento Salvo!');
    });
});

})

//Recebe o endereço do unity
ipcMain.on('LocalizaUnity', async () => {
  const pathdoUnity = await handleFileOpen();
  Unity = pathdoUnity;
  console.log("Unity: "+ pathdoUnity);
})

//Recebe o endereço do projeto
ipcMain.on('LocalizaProjeto', async () => {
  const pathdoProjeto = await handleFolderOpen();
  Projeto = pathdoProjeto;
  console.log("Proj: "+ pathdoProjeto);
})

//Função que chama a linha de comando no prompt/terminal
ipcMain.on('Executacomando', function ExecutaComando() {
  exec( '"'+ Unity +'" -batchmode -quit -projectPath '+ Projeto +' -executeMethod BuilderLinhaComando.PerformBuild', (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});
})


/////////////////////////////////////////
//FUNÇÕES DE JANELA DO ELECTRON

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