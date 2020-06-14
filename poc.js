const AWS = require('aws-sdk');

const videoUrl = 'https://pipeline-videos-dev.s3.ap-south-1.amazonaws.com/testing_video_edit/sample-col-01.mp4';
// https://s3.ap-south-1.amazonaws.com/multiply-dev.simsim.in/public/testing/jokerpart2.mp4
module.exports = async (start, end) => {
    const s3 = new AWS.S3();
    const params = {
        Bucket: 'multiply-dev.simsim.in', /* required */
        Key: 'public/testing/jokerpart2.mp4', /* required */
        Range: `bytes=${start}-${end}`,
    };

    return new Promise((resolve, reject) => {
        s3.getObject(params, function (err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                reject("Unable to get objects");
            }
            else {
                console.time("Fetch Time: ");
                resolve(data);
                console.timeEnd("Fetch Time: ");
            }
        });
    })

}