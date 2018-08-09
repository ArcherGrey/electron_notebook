const ipc = require('electron').ipcRenderer;
const fs = require('fs');




// 监听主进程action事件
ipc.on('action', (event, message, others) => {
    switch (message) {
        case 'new':
            if (!document.getElementById('txtEditor').style.display)
                document.getElementById('txtEditor').style.display = 'block';
            document.getElementById('txtEditor').value = '';
            break;
        case 'open':
            var filepath = others[0];
            fs.readFile(filepath, 'utf8', (err, data) => {
                if (err) console.log(err);
                if (!document.getElementById('txtEditor').style.display)
                    document.getElementById('txtEditor').style.display = 'block';
                initContent = data;
                document.getElementById('txtEditor').value = data;
            })
            break;
        case 'save':
            var filepath = others;
            fs.writeFile(filepath, document.getElementById('txtEditor').value, (err) => {
                if (!err) {
                    initContent = document.getElementById('txtEditor').value
                    alert('保存成功');
                    return;
                }
                alert(err);
            })
            break;
        case 'about':
            alert('版权所有:ArcherGrey')

    };

});





