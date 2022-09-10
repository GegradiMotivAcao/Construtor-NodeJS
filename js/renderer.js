const btn = document.getElementById('bot_o_add_cls_a')
const btn2 = document.getElementById('bot_o_positivo_2_colunas_cls_a')
const filePathElement = document.getElementById('filePath')
const fs = require('fs');
 // Load the File System to execute our common tasks (CRUD)


btn.addEventListener('click', async () => {
  const filePath = await window.electronAPI.openFile()
  filePathElement.innerText += "\n"+ filePath
})

let content = "Gabiru e Perdigão VS Barça do Ronaldo";
btn2.addEventListener('click', async () => {
  console.log("clicou");
  fs.writeFile("../teste.txt", content, (err) => {
    if(err){
        alert("An error ocurred creating the file "+ err.message)
    }
                
    alert("The file has been succesfully saved");
});
})
