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
  enderecoSelect = {"path": pathdoarq,
                    "tipo": "1" }
    enderecos.push(enderecoSelect);

  //ESCREVE NO ARQUIVO 
  enderecos.forEach(element => {
      fs.appendFile('./js/teste.txt', "<background>" + element.path + ";"+ element.tipo + "</background>\n", function (err) {
        if (err) throw err;
        console.log('Saved!');
        enderecos = []; //LIMPA O ARRAY
      });
    });
})

//escreve caminhos de Elementos no arquivo
ipcMain.on('escreveElemento', async () => {
  const pathdoarq = await handleFileOpen();
  enderecoSelect = {"path": pathdoarq,
                    "tipo": "2" }
    enderecos.push(enderecoSelect);

  //ESCREVE NO ARQUIVO 
  enderecos.forEach(element => {
      fs.appendFile('./js/teste.txt', "<elemento>" + element.path + ";"+ element.tipo + "</elemento>\n", function (err) {
        if (err) throw err;
        console.log('Saved!');
        enderecos = []; //LIMPA O ARRAY
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
//Resolver problema de espaço no nome das pastas ao executar comando no cmd
//C:\\"Program Files"\\Unity\\Hub\\Editor\\2018.4.35f1\\Editor\\unity.exe  -batchmode -quit -projectPath D:\Projetos\GEGRADI\Motivacao-Builder-LOCAL -executeMethod BuilderLinhaComando.PerformBuild'
//Função que chama a linha de comando no prompt/terminal
ipcMain.on('Executacomando', function ExecutaComando() {
  exec( Unity +' -batchmode -quit -projectPath '+ Projeto +' -executeMethod BuilderLinhaComando.PerformBuild', (error, stdout, stderr) => {
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