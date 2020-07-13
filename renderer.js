// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const { ipcRenderer } = require('electron')
const { dialog } = require('electron').remote

const base = "https://electricity-moon.surge.sh"
let url = base + '/generator.html'

window.addEventListener('message', event => {
  if (event.origin.startsWith(base)) {
    url = base + '/generator.html?' + decodeURI(event.data)
  }
});

const button = document.getElementById('run')
button.onclick = () => {
  let filename = dialog.showSaveDialogSync(
    { 
      title: 'animaatio',
      defaultPath: '~/animaatio.mp4'
    }
  )
  
  if(filename) {
    document.getElementById('overlay').classList.remove('hidden')
    ipcRenderer.send('record', url, filename)
  }
}

const reload = document.getElementById('reload')
reload.onclick = () => {
  let text = document.getElementById('text').value
  let meta = document.getElementById('date').value
  url = url.replace(/title=.*&meta/, 'title='+ encodeURI(text) +'&meta')
  url = url.replace(/meta=.*&vertical/, 'meta='+ encodeURI(meta) +'&vertical')
  document.getElementById('animation').src = url
}

const refresh = document.getElementById('new')
refresh.onclick = () => {
  document.getElementById('animation').src = base + "/generator.html"
}

ipcRenderer.on('hide' , function(){
  document.getElementById('overlay').classList.add('hidden')
});