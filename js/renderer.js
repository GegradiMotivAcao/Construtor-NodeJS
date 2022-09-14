const btn = document.getElementById('bot_o_add_cls_a')
const btn2 = document.getElementById('bot_o_positivo_2_colunas_cls_a')
const btn3 = document.getElementById('botão2')

const filePathElement = document.getElementById('filePath')

 // Load the File System to execute our common tasks (CRUD)


btn.addEventListener('click', async () => {
  const filePath = await window.electronAPI.openFile()
  filePathElement.innerText += "\n"+ filePath
})

btn2.addEventListener('click', async () => {
  window.electronAPI.escreve()
})

btn3.addEventListener('click', async () => {
  window.electronAPI.comando()
})

