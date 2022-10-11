const btn = document.getElementById('bot_o_add_cls_a')
const btn2 = document.getElementById('bot_o_positivo_2_colunas_cls_a')
const btn3 = document.getElementById('botão2')
const btn4 = document.getElementById('btn_add_bg')
const btn5 = document.getElementById('btn_add_unity')
const btn6 = document.getElementById('btn_add_proj')

const filePathElement = document.getElementById('filePath')

//BTN ADD ELEMENTO
btn.addEventListener('click', async () => {
  //ESCRITA NO ARQUIVO COMO ELEMENTO
  window.electronAPI.escreveElemento();

})

//BTN AVANÇAR
btn2.addEventListener('click', async () => {
  //DA HIDE NO DIV ATUAL E PASSA PRO PRÓXIMO DIV DE SELEÇÃO
 // window.electronAPI.escreveElemento(7)
})

//BTN COMANDO
btn3.addEventListener('click', async () => {
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