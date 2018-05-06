let fs = require('fs');
let path = require('path');
let process = require('process');
let superagent = require('superagent');

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
        let stream = fs.createWriteStream(path.join(process.cwd()+'/img', item.name + item.format));
        let url = item.src;
        console.log(`begin download img ${item.name}`);
        // 10秒抓一张照片，看会不会被反爬
        setTimeout(() => {
            superagent.get(url).set({
                'Connection': 'keep-alive'
            }).pipe(stream)
                .on('finish', resolve(`img ${item.name} has downloaded !`))
                .on('error', reject(`img ${item.name} download fail !`))
        }, 10000)
    })
}

async function downloadImg(imgList) {
    for (let [index, item] of Object.entries(imgList)) {
        await requestDownload(item).then((d) => {
            console.log(d)
        }).catch(e => {
            console.log('downloadSong', e);
        })
    }
    return 'download over';
}

module.exports = {
    getImg: getImg,
    downloadImg: downloadImg
}