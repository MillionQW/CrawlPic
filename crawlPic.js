let superagent = require('superagent');
let cheerio = require('cheerio');
let express = require('express');
let utils = require('./utils/utils');

let app = express();

app.get('/', (req, res, next) => {
    // 为什么这里要把next传入？
    sendRequest('https://www.douban.com/photos/album/82212167/', 0, next)
})

app.listen(3000, () => {

})

function sendRequest(url, num, next) {
    // 发请求抓取网页
    superagent.get(url + `?start=${num ? num : 0}`)
        .end((err, sres, req) => {
            if (err) {
                // console.log(err)
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
                // 把图片src数组传入下载图片
                utils.down(imgList).then(() => {
                    num += 18;
                    // 递归调用，分页抓取
                    sendRequest(url, num);
                })
            } else {
                res.send(imgList)
                console.log('下载完成');
                res.end();

            }
            
        })
}

