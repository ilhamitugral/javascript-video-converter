let options = {}
const { ipcRenderer } = require('electron')

const selectFile = document.getElementById('select-file');

const buttons = [
    'btn-file',
    'file-types',
    'btn-convert'
];

document.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.send('get-options-request')
})

ipcRenderer.on('get-options-result', (e, data) => {
    document.getElementById('page-title').innerText = data.title;
    setDescription(data.description);
    document.getElementById('copyright-value').innerText = data.copyright;

    let accept = "";
    for(let i = 0; i < data.fileTypes.length; i++) {
        const el = document.createElement('option')
        el.setAttribute('value', Object.keys(data.fileTypes[i]));
        el.innerText = '.' + Object.keys(data.fileTypes[i]);
        document.getElementById('file-types').appendChild(el);
        accept += Object.values(data.fileTypes[i]) + ','
    }

    selectFile.setAttribute('accept', accept.substring(0, accept.length - 1));
})

const chooseFile = () => {
    selectFile.click();
}

selectFile.addEventListener('change', (e) => {
    const btnEl = document.getElementById('btn-file');
    const fileName = selectFile.files[0].name;

    let name = ''
    if(fileName.length > 16) {
        name = fileName.substring(0, 8) + '...' + fileName.substring(fileName.length - 8, fileName.length)
    }else {
        name = fileName
    }

    btnEl.innerText = name;
})

const convert = () => {
    if(selectFile.files.length > 0) {
        ipcRenderer.send('convert-file', {
            path: selectFile.files[0].path,
            to: document.getElementById('file-types').value
        })
    }else {
        setDescription('Lütfen Dosya Seçiniz...')
    }
}

const setDescription = (value) => {
    document.getElementById('page-description').innerText = value;
}

ipcRenderer.on('set-description', (e, value) => {
    setDescription(value);
})

const setLock = (value) => {
    let el;
    buttons.forEach(button => {
        el = document.getElementById(button)
        if(value) {
            el.setAttribute('disabled', '')
            el.classList.add('disabled')
        }else {
            el.removeAttribute('disabled')
            el.classList.remove('disabled')
        }
    })
}

ipcRenderer.on('change-lock', (e, value) => {
    setLock(value)
})