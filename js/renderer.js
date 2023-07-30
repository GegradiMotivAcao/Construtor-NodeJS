const btn = document.getElementById('btn_add_imagens')
const btn2 = document.getElementById('bot_o_positivo_2_colunas_cls_a')
const btn3 = document.getElementById('botão2')
const btn4 = document.getElementById('btn_add_bg')
const btn5 = document.getElementById('btn_add_unity')
const btn6 = document.getElementById('btn_add_proj')
const btn7 = document.getElementById('btn_ajuda')

const filePathElement = document.getElementById('filePath')

//BTN ADD ELEMENTO
btn.addEventListener('click', async () => {
  //ESCRITA NO ARQUIVO COMO ELEMENTO
  window.electronAPI.escreveElemento();

})

//BTN COMANDO
btn3.addEventListener('click', async () => {
  console.log("buildando.. .")
  window.electronAPI.comando()
})

//BTN ADD BACKGROUND
btn4.addEventListener('click', async () => {
  await window.electronAPI.escreveBackground()
})

//BTN ADD caminho do unity
btn5.addEventListener('click', async () => {
  await window.electronAPI.encontraUnity()
})

//BTN ADD Caminho do projeto
btn6.addEventListener('click', async () => {
  await window.electronAPI.encontraProjeto()
})

//BTN AJUDA / CREDITOS
btn7.addEventListener('click', async () => {
  await window.electronAPI.abreajuda()
})