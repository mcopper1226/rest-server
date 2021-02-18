const express = require('express')
const app = express();
const port = 8000;
const fs = require('fs');


var requestTime = function (req, res, next) {
    req.requestTime = Date.now()
    console.log(req.requestTime)
    next()
  }

  const processFiles = function (req, res, next) {
    const foo = (folder) => {
        return new Promise((resolve, reject) => {
            fs.readdir(folder, (err, files) => {
                if (err) 
                    reject(err); 
                else 
                    resolve(files);
            });
        });
    };
    const bar = (filename) => {
        return new Promise((resolve, reject) => {
            fs.readFile(`./routes/${filename}`, (err, data) => {
                if (err) 
                    reject(err); 
                else 
                    resolve(JSON.parse(data));
            });
        });
    };
    const test = foo('./routes').then(files => {
        const list = files.map((file) => bar(file))
        console.log(list)
    })
    // const test = fs.readdir('./routes', { withFileTypes: false }, (err, files) => {
    //     return files.map(file => {
    //         const filePath = `./routes/${file}`
    //         const match = file.match(/.+?(?=\.json)/)
    //         if (!match.length > 0) {
    //             throw err('That was not a json file.')
    //         }
    //         const json = fs.readFileSync(filePath, 'utf-8', (err, data) => {
    //             if (err) throw err
    //             return JSON.parse(data)
    //           })
    //           return {
    //               [match[0]]: json
    //           }
    //     })
    // }).then()
    // console.log(test);
    const getFiles = async (directory) => {
        return fs.readdir('./routes', { withFileTypes: false }, (err, files) => {
            return files
        })
    }

    const runAll = async () => {
        return await getFiles()
    }

    req.dataSet = runAll();
    next()
  }
  
  app.use('/time', processFiles)
  
  app.get('/time', function (req, res) {
    var responseText = 'Hello World!<br>'
    res.send(req.dataSet)
  })

  app.get('/', (req, res) => {
    res.send('Hello World!')
  });
  

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});