
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const url = require('url');
const path = require('path');
const isDev = require("electron-is-dev");
const MODO_APLICACAO = require('./utils/appMode');
const Authentication = require('./utils/authentication');
const routes = require('./utils/routes');
const internalDatabase = require('./config/internalDatabase');
const Database = require('./config/database');
const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../build/index.html')}`;
const fs = require('fs');
let win = null;
const createWindow = () => {



    win = new BrowserWindow({
        width: 350,
        height: 600,
        minWidth: 350,
        minHeight: 600,
        contextIsolation: true,
        maximizable: false,
        resizable: false,
        webPreferences: {
            preload: isDev
                ? path.join(app.getAppPath(), './public/preload.js')
                : path.join(app.getAppPath(), './build/preload.js'),
            worldSafeExecuteJavaScript: true,
            contextIsolation: true,
        },
    })
    // win.maximize();
    win.loadURL(startUrl);
    win.setMenu(null);
    win.setTitle("Central Integrada de Alternativas Penais");

    if (isDev) {
        win.webContents.on('did-frame-finish-load', () => {
            win.webContents.openDevTools({ mode: 'detach' });
        });
    }


}


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.whenReady().then(async () => {

    //Verificar se a pasta onde irá ficar as bases SQlite existe
    if (!fs.existsSync('C://ciapp/database')) {
        fs.mkdirSync('C://ciapp/database', { recursive: true });
    }


    //Testar conexão com banco interno
    let connInternal = await connectInternalDatabase();

    if (!connInternal.status) {
        dialog.showErrorBox("Não foi possível instanciar a base de dados interna no sistema.", connInternal.text);
        return;
    }
    else {

        let connExternal = await Database.ConnectExternalDatabase(false);

        if (!connExternal.status) {
            dialog.showMessageBox({
                type: 'warning',
                title: 'Atenção, não foi possível completar a conexão com o banco de dados.',
                message: 'Por Favor verifique os dados de conexão na configuração de banco de dados\n' + connExternal.text,
                buttons: ['OK']
            })
        }

    }

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
})


const connectInternalDatabase = async () => {
    let resultText = "Conectando com base interna de dados...\n";
    try {

        await internalDatabase.authenticate();
        resultText += "Conexão estabelecida com sucesso.\n";
        await internalDatabase.sync({ force: false });
        resultText += "Tabelas sincronizadas com sucesso.\n";
        return { status: true, text: resultText };
    } catch (error) {
        resultText += "ERRO AO CONECTAR NA BASE INTERNA: " + error;
        return { status: false, text: resultText };
    }

}


ipcMain.handle('MODO_APLICACAO', async () => {

    return MODO_APLICACAO.modo;
})

ipcMain.handle('maximize', async () => {

    win.maximizable = true;
    win.resizable = true;
    win.setMinimumSize(1090, 640)
    win.setSize(1366, 768);
  
    win.maximize();
})

ipcMain.handle('unmaximize', async () => {
    win.unmaximize();
    win.setMinimumSize(350, 600)
    win.setSize(350, 600);

    win.maximizable = false;
    win.resizable = false;
})

ipcMain.handle('action', async (event, args) => {
    try {
        if (!args.controller)
            return { status: false, text: "Controller not indetified" };
        if (!args.action)
            return { status: false, text: "Action not indetified" };

        let controller = args.controller.toLowerCase().trim();

        //Se a controller não for a de configuração de banco, então valida a conexão com o banco externo
        if (controller != 'config') {
            let connExternal = await Database.CheckConnectionDatabase();
            if (!connExternal.status) {
                dialog.showErrorBox('Não foi possível conectar na base de dados, verifique os dados de autenticação', connExternal.text);
                return { status: false, text: "Não foi possível conectar na base de dados.\n" + connExternal.text };
            }
            if (!Authentication.isAuthenticated && controller != 'login') {
                win.webContents.send('redirect-login');
                return { status: false, text: "Unauthorized", unauthorized: true };
            }
        }


        // if (args.controller != 'Login' && args.controller != 'Authenticate' && (args.controller != 'Sincronizacao' && args.action != 'SetFile')) {
        //     win.webContents.send('redirect-login');
        //     return { status: false, text: "Unauthorized", unauthorized: true };
        // }
        const routesResult = await routes.Action(args.controller, args.action, args.params);
        return routesResult;
    } catch (error) {
        return { status: false, text: "General error: " + error };
    }


})