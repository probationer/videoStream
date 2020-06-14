const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const S3VideoStreamer = require('../poc');
const fs = require('fs');

const app = express();

const port = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get('/video1', async (req, res) => {
    const byteRange = req.header('range');
    const range = byteRange.replace('bytes=','').split('-');
    const start = parseInt(range[0]);
    const end = parseInt(range[1]) || start + 1000000;
    const s3PartVideo = await S3VideoStreamer(start, end);
    const head = {
        'Content-Range': s3PartVideo.ContentRange,
        'Accept-Ranges': s3PartVideo.AcceptRanges,
        'Content-Length': s3PartVideo.ContentLength,
        'Content-Type': 'video/mp4'
    }
    res.writeHead(206, head);
    return res.end(s3PartVideo.Body);
});


app.get('/video', function (req, res) {
    const path = '/Users/admin/Documents/program/learn/videoStream/IronMan100mb.mp4';
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const range = req.headers.range
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1
        const file = fs.createReadStream(path, { start, end })
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
    }
});

app.listen(port, () => console.log(`app listening at http://localhost:${port}`));