import video from '../../../models/video.js'
import mongoose from 'mongoose';
import * as fs from 'fs';

export const writeVideo = (req, res) => {
    const content = req.body.content;
    const publisherId = req.params.userId;
  
    const newVideo = new Video({
      _id: new mongoose.Types.ObjectId(),
      publisher: publisherId,
      video: new mongoose.Types.ObjectId(),
    });
  
    // 创建一个可写流
    var writerStream = fs.createWriteStream('video.txt');
  
    // 管道读写操作
    // 读取 input.txt 文件内容，并将内容写入到 output.txt 文件中
    writerStream.write(content);
  
    writerStream.on('finish', () => {
      let db = mongoose.connection;
      let bucket = new mongoose.mongo.GridFSBucket(db);
  
      newVideo.save((err, savedVideo) => {
        const openUploadStream = bucket.openUploadStreamWithId(savedVideo.video, 'video.txt');
  
        fs.createReadStream('video.txt')
          .pipe(openUploadStream)
      })
    });
  
    writerStream.end();
    res.send({ saved: 'true' });
  };

  export const getVideo = (req, res) => {
    const db = mongoose.connection;
    const gridfsBucket = new mongoose.mongo.GridFSBucket(db.db);
  
    const readStream = gridfsBucket.openDownloadStream(mongoose.Types.ObjectId(req.params.videoId));
    
    readStream.pipe(res);
  };

  export const getVideoList = (req, res) => {
    const limit = parseInt(req.params.limit);
  
    try {
      Video.find({}).limit(10 * limit)
        .exec((err, videos) => {
          if (err) throw new Error(`processing error in request`)
          const clone_videos = [...videos];
          const videosList = clone_videos.splice((limit - 1) * 10, 10);
  
          res.send({ videosList });
        });
    } catch (error) {
      res.send('sth happen');
    }
  }