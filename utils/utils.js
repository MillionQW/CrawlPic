let fs = require('fs');
let path = require('path');
let process = require('process');
let superagent = require('superagent');

// 对url做处理，抽出图片格式和图片名
function getImg(url) {
    let index; 
    let name;
    index = url.indexOf('public/') + 7;
    formatIndex = url.lastIndexOf('.');
    name = url.slice(index, formatIndex);
    format = url.slice(formatIndex);
    return {
        name: name,
        format: format
    };
}

function requestDownload(item) {
    return new Promise((resolve, reject) => {
        // 创建一个写流，join()第一个参数是保存路径，第二个是文件名 + 格式
        let stream = fs.createWriteStream(path.join(process.cwd()+'/img', item.name + item.format));
        let url = item.src;
        console.log(`begin download img ${item.name}`);
        // 10秒抓一张照片，看会不会被反爬，无法实验，因为已经被限制了..
        setTimeout(() => {
            // 用superagent发起请求，set()用于设置请求头,抓取单张图片
            superagent.get(url).set({
                'Connection': 'keep-alive'
            }).pipe(stream)
                .on('finish', resolve(`img ${item.name} has downloaded !`))
                .on('error', reject(`img ${item.name} download fail !`))
        }, 10000)
    })
}

async function downloadImg(imgList) {
    // 数组的解构赋值
    for (let [index, item] of Object.entries(imgList)) {
        await requestDownload(item).then((d) => {
            console.log(d)
        }).catch(e => {
            console.log('downloadSong', e);
        })
    }
    return 'download over';
}

function down(imgList) {
    return new Promise((resolve, reject) => {
        downloadImg(imgList);
        setTimeout(() => {
            resolve();
        }, 1)
    })
}

module.exports = {
    getImg: getImg,
    down: down
}