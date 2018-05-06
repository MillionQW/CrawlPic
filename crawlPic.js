let superagent = require('superagent');
let cheerio = require('cheerio');
let express = require('express');
let utils = require('./utils/utils');

let app = express();

app.get('/', (req, res, next) => {
    sendRequest('https://www.douban.com/photos/album/82212167/', 0)
})

app.listen(3000, () => {

})

function sendRequest(url, num) {
    superagent.get(url + `?start=${num ? num : 0}`)
        .end((err, sres) => {
            if (err) {
                console.log(err)
                return next(err);
            }
            let $ = cheerio.load(sres.text);
            let imgList = [];
            if ($('.photolst img')) {
                $('.photolst img').each((index, element) => {
                    let img = element;
                    let src = img.attribs.src;
                    img = utils.getImg(src);
                    let name = img.name;
                    let format = img.format;
                    img = {
                        name: name,
                        src: src,
                        format: format
                    }
                    imgList.push(img);
                })
                down(imgList).then(() => {
                    num += 18;
                    sendRequest(url, num);
                })
            } else {
                res.send(imgList)
                console.log('下载完成');
                res.end();

            }
            
        })
}

function down(imgList) {
    return new Promise((resolve, reject) => {
        utils.downloadImg(imgList);
        setTimeout(() => {
            resolve();
        }, 1)
    })
}