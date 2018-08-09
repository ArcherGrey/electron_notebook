const { app, BrowserWindow, MenuItem } = require('electron');
const Menu = require('electron').Menu;
const ipc = require('electron').ipcMain;
const dialog = require('electron').dialog;


let win;

function createWindow() {
    win = new BrowserWindow({ width: 800, height: 600 });
    win.loadFile('index.html');

    // 打开调试工具
    // win.webContents.openDevTools();

    win.on('closed', () => {
        win = null;
    });




}

function initMenu() {

    // 模板
    let template = [
        {
            label: "文件",
            submenu: [
                {
                    label: "新建",
                    accelerator: 'Ctrl+N',
                    click: function (item, focusedWindow, event) {
                        // 向渲染进程发送异步消息，action 为事件类型 ，message 为 new
                        win.webContents.send('action', 'new');
                    }
                },
                {
                    label: "打开...",
                    accelerator: 'Ctrl+O',
                    click: function (item, focusedWindow, event) {
                        dialog.showOpenDialog({}, function (filepath) {
                            if (filepath)
                                win.webContents.send('action', 'open', filepath);
                        })
                    }
                },
                {
                    label: "保存",
                    accelerator: 'Ctrl+S',
                    click: function (item, focusedWindow, event) {
                        const options = {
                            title: '保存文件',
                            filters: [
                                { name: 'txt', extensions: ['txt'] }
                            ]
                        };
                        dialog.showSaveDialog(options, function (filepath) {
                            win.webContents.send('action', 'save', filepath);
                        });
                    }
                },
                {
                    // 分隔符
                    type: "separator"
                },
                {
                    label: "退出",
                    role: 'quit'
                }
            ]
        },
        {
            label: '编辑',
            submenu: [
                {
                    label: '撤销',
                    accelerator: 'Ctrl+Z',
                    // 使用 role 的时候会使用原生的功能，如果配置click，role就失效
                    role: 'undo'
                },
                {
                    label: '重做',
                    accelerator: 'Ctrl+Y',
                    // 使用 role 的时候会使用原生的功能，如果配置click，role就失效
                    role: 'redo'
                },
                {
                    type: 'separator'
                },
                {
                    label: '剪切',
                    accelerator: 'Ctrl+X',
                    role: 'cut'
                },
                {
                    label: '复制',
                    accelerator: 'Ctrl+C',
                    role: 'copy'
                },
                {
                    label: '粘贴',
                    accelerator: 'Ctrl+V',
                    role: 'paste'
                },
                {
                    label: '删除',
                    accelerator: 'Delete',
                    role: 'delete'
                },
                {
                    type: 'separator'
                },
                {
                    label: '全选',
                    accelerator: 'Ctrl+A',
                    role: 'selectAll'
                }
            ]
        },
        {
            label: '帮助',
            submenu: [
                {
                    label: '关于',
                    click: function (item, focusedWindow, event) {
                        win.webContents.send('action', 'about');
                    }
                }
            ]
        }
    ];

    // 通过模板来生成菜单
    const menu = Menu.buildFromTemplate(template);
    // 设置应用菜单
    Menu.setApplicationMenu(menu);
}

app.on('ready', () => {
    createWindow();
    initMenu();
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});
