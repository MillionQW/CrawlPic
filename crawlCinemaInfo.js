let path = require('path');
let fs = require('fs');
let superagent = require('superagent');
let cheerio = require('cheerio');
let express = require('express');
let utils = require('./utils/utils');

let app = express();

app.get('/', (req, res, next) => {
    sendRequest('https://movie.douban.com/j/search_subjects?type=movie&tag=%E6%9C%80%E6%96%B0&page_limit=200&page_start=0', next)
})

app.listen(3000, () => {});
let result;
function sendRequest(url, next) {
    superagent.get(url)
        .set('Connection', 'keep-alive')
        .set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8')
        .set('Cookie', 'bid=VMoFeLpU9F8; ll="118281"; __yadk_uid=Jb2dE9ih5P9UBSPukEACyyml8kRL64hf; _vwo_uuid_v2=D7AD1D0B81A0F0895B7C34C6D7E207336|e9f8c3263747500caed49b4435c1f63c; _ga=GA1.2.1938492870.1517030259; __utmv=30149280.1348; gr_user_id=1ce21120-cea9-4a0f-b367-b5a86b7fb0e4; viewed="26918038_10746113_26176870_27033213_6403660_25724948_6021440"; douban-fav-remind=1; ct=y; __utmc=30149280; __utmz=30149280.1533353070.27.13.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); __utma=30149280.1938492870.1517030259.1533353070.1533386108.28; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1533386117%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_ses.100001.4cf6=*; __utma=223695111.1281750298.1519867643.1533269494.1533386117.8; __utmc=223695111; __utmz=223695111.1533386117.8.8.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; ps=y; ue="516155382@qq.com"; dbcl2="13482581:FfsMlug/C48"; ck=b--w; push_noty_num=0; push_doumail_num=0; ap=1; __utmb=30149280.8.10.1533386108; __utmt=1; _pk_id.100001.4cf6=80144eb014acc108.1519867643.8.1533387710.1533270906.; __utmb=223695111.10.10.1533386117')
        .set('Host', 'movie.douban.com')
        .set('User-Agent', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36')
        .end((err, res, req) => {
            if (err) {
                return next(err);
            } else {
                result = res.body.subjects;

                // Info 储存路径
                let date = new Date();
                let content = '';
                let year = date.getFullYear(),
                    month = date.getMonth() + 1,
                    day = date.getDate(),
                    hour = date.getHours(),
                    min = date.getMinutes();
                let Infopath = path.join(__dirname, `./CinemaInfo/cinema${year}${month}${day}${hour}${min}.json`);
                result.forEach((item, index) => {
                    if (index == 0) {
                        content += `{
                        "cinema": [{
                            "title": "${item.title}",
                            "cover": "${item.cover}",
                            "rate": ${item.rate}
                        },`
                        return;
                    }
                    if(index == result.length - 1) {
                        content += `{
                                "title": "${item.title}",
                                "cover": "${item.cover}",
                                "rate": ${item.rate}
                            }
                        ]
                    }`
                        return;
                    }
                    content += `{
                        "title": "${item.title}",
                        "cover": "${item.cover}",
                        "rate": ${item.rate}
                    },`
                })
                fs.open(Infopath, 'a', 0644, function (e, fd) {
                    if (e) throw e;
                    fs.write(fd, content, function (e) {
                        if (e) throw e;
                        fs.closeSync(fd);
                    })
                });
            }
        })
}

