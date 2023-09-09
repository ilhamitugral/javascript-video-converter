const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const ffmpeg = require('ffmpeg')
const options = require('./options.json')

let mainWindow
const createWindow = () => {
    mainWindow = new BrowserWindow({
        autoHideMenuBar: true,
        width: 640,
        height: 245,
        maximizable: false,
        fullscreenable: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })

    mainWindow.loadFile(path.join(__dirname, 'index.html'))
}

app.whenReady().then(() => {
    createWindow()

    ipcMain.on('get-options-request', (e) => {
        e.sender.send('get-options-result', options)
    })

    ipcMain.on('convert-file', (e, data) => {
        const fileName = data.path.split(".").slice(0, -1).join(".") + "-converted"

        try {
            const process = new ffmpeg(data.path)
            process.then((video) => {
                e.sender.send('set-description', "Dosya dönüştürülüyor...")
                e.sender.send('change-lock', true)

                video.save(fileName + "." + data.to, (error, file) => {
                    if(!error) {
                        e.sender.send('set-description', "Dönüştürme tamamlandı.")
                        e.sender.send('change-lock', false)
                    }
                })
            }, (err) => {
                e.sender.send('set-description', err)
            })
        }catch(e) {
            console.log(e)
        }
    })
})

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit();
})