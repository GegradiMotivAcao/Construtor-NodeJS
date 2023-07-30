const {app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const { exec } = require("child_process"); //permite executar linha no cmd/terminal
const path = require('path')
const fs = require('fs');

let enderecos = [];
let enderecoSelect= {};
let Unity="";
let Projeto="";

let OKunity = false;
let OKproj = false;
let OKbg = false;
let OKimg = false;
//RODAR: npm run start

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
  exec( 'copy '+ '"' + pathdoarq +'" '+ '"' + Projeto + '\\Assets\\Resources\\backgrounds"', (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: SUCESSO! ${stdout}`);
    fs.appendFile(Projeto + '\\Assets\\Resources\\lista.txt', "backgrounds\\" + nomeArq + ";0;0\n", function (err) {
      if (err) throw err;
      console.log('BG Salvo!');
    });
    OKbg = true;
});

});

//escreve caminhos de Elementos no arquivo
ipcMain.on('escreveElemento', async () => {
  const pathdoarq = await handleFileOpen();
  nomeArq = path.basename(pathdoarq);

  exec( 'copy '+ '"' + pathdoarq +'" '+ '"' + Projeto + '\\Assets\\Resources\\objetos"', (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    fs.appendFile(Projeto + '\\Assets\\Resources\\lista.txt', "objetos\\"+ nomeArq + ";1;0\n", function (err) {
      if (err) throw err;
      console.log('Elemento Salvo!');
    });
    OKimg = true;
});

})

//Recebe o endereço do unity
ipcMain.on('LocalizaUnity', async () => {
  const pathdoUnity = await handleFileOpen();
  Unity = pathdoUnity;
  console.log("Unity: "+ pathdoUnity);
  if (pathdoUnity) {
    OKunity = true;
  }
})

//Recebe o endereço do projeto
ipcMain.on('LocalizaProjeto', async () => {
  const pathdoProjeto = await handleFolderOpen();
  Projeto = pathdoProjeto;
  console.log("Proj: "+ pathdoProjeto);
  if(pathdoProjeto){
    OKproj=true;
  }
})

ipcMain.on('AbreAjuda', async () => {

  const mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    width: 850, height: 700,
    resizable: false

  })
  mainWindow.loadFile('views/ajuda.html')

})

//Função que chama a linha de comando no prompt/terminal
ipcMain.on('Executacomando', function ExecutaComando() {

  const options = {
    type: 'question',
    buttons: ['OK'],
    defaultId: 2,
    title: 'Erro!',
    message: 'Você precisa selecionar uma instalação do unity. (Ex: "unity.exe")',
  };

  if(!OKunity) {
    console.log("Falta unity!") 
    dialog.showMessageBox(null, options);
    return
  }
  if(!OKproj) {
    console.log("Falta projeto!") 
    options.message = 'Você precisa selecionar uma pasta de projeto MotivaAção. '
    dialog.showMessageBox(null, options);
    return
  }
  if(!OKbg) {
    console.log("Falta BG!") 
    options.message = 'Você precisa selecionar uma imagem de fundo para sua cena.'
    dialog.showMessageBox(null, options);
    return
  }
  if(!OKimg) {
    console.log("Falta imagens!") 
    options.message = 'Você precisa selecionar uma ou mais imagens de componentes para sua cena.'
    dialog.showMessageBox(null, options);
    return
  }

 const mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    width: 1200, height: 600,
  })
  mainWindow.loadFile('views/loading.html')

  exec( '"'+ Unity +'" -batchmode -quit -projectPath '+ Projeto +' -executeMethod BuilderLinhaComando.PerformBuild', (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: SUCCESS ${stdout}`);
    mainWindow.close();

    shell.openPath(Projeto)
});
})


/////////////////////////////////////////
//FUNÇÕES DE JANELA DO ELECTRON

function createWindow () {
  const mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }, resizable: false,
    icon: path.join(__dirname, 'skins/logoMotiv.png') 
  })
  mainWindow.loadFile('views/construtor.html')
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

///////////////////////////////////////////////////////////
//build com electron: 
//npx electron-packager <sourcedir> <appname> --platform=win32
