const cheerio = require('cheerio')
const https = require('https')
const fs = require('fs');

https.get(`https://ryan.pub/posts/`, res => {
  let data = ""
  res.on("data", function (chunk) {
    data += chunk;
  })
  res.on("end", function () {
    console.log("[success] Pull Recent Posts")
    const $ = cheerio.load(data)
    const result = $('.archive-item a').map((i, v) => {
      return `- [${v.children[0].data}](https://ryan.pub${v.attribs.href})`
    })
    const targetText = Array.prototype.join.call(result, "\n")

    fs.readFile('./README.md', 'utf-8', (err, data) => {
      if (err) {
        console.log(err.message)
      } else {
        const reg = /\[comment\]:<article-list>(.|\s|[\r\n])*\[comment\]:<article-list>/g
        fs.writeFile('./README.md', data.replace(reg, `[comment]:<article-list>\n${targetText}\n\n[comment]:<article-list>`), "utf8", (err) => {
          console.log('[[success] Rewrite Readme.md]')
        })
      }
    })
  })
})

