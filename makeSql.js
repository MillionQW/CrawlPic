let fs = require('fs');
let path = require('path');

let cinemaInfoPath = path.join(__dirname, './CinemaInfo/cinema2018851049.json');
let cinemaInfos;
let sqlContent = `INSERT INTO cinema(title, cover, rate) VALUES`;

fs.readFile(cinemaInfoPath, 'utf8', function(err,data) {
    if (err) throw err;
    cinemaInfos = JSON.parse(data).cinema;

    cinemaInfos.forEach((item, index) => {
        if (index == cinemaInfos.length - 1) {
            sqlContent += `('${item.title}', '${item.cover}', ${item.rate});`
            return;
        }
        sqlContent += `('${item.title}', '${item.cover}', ${item.rate}),`
    })
    fs.open('cinemaInfo.sql', 'a', 0644, function(err, fd) {
        if(err) throw err;
        fs.write(fd, sqlContent, function(err) {
            if(err) throw err;
            fs.closeSync(fd)
        })
    })
})
