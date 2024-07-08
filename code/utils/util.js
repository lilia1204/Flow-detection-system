

// function setCanvasShape(w,h,lable_info,video_info){
//   console.log(lable_info)
//   const lw = lable_info['width']
//   const lh = lable_info['height']
//   if (w / h > lable_info['ratio']) {//偏宽
//     video_info['width'] = lw
//     video_info['dx'] = 0

//     video_info['height'] = lw * h / w
//     video_info['dy'] = (lh - video_info['height']) / 2
//   } else {//偏高
//     video_info['height'] = lh
//     video_info['dy'] = 0

//     video_info['width'] = lh * w / h
//     video_info['dx'] = (lw - video_info['width']) / 2
//   }
// }

// // cvs 和 ctx
// function canvasWait(canvas){
//   const ctx=canvas['ctx']
//   const cvs=canvas['cvs']

//   ctx.clearRect(0, 0, cvs.width, cvs.height);
//   ctx.fillStyle = '#f5f2d7';
//   ctx.fillRect(0, 0, cvs.width, cvs.height);
//   ctx.font = '30px Arial';
//   ctx.fillStyle = 'black';
//   ctx.fillText('监测屏幕', 90, 60);
//   ctx.fillText('等待监测', 90, 110);

// }

// function setVideo(i_this,lable_info,video_info,canvas){
//   const that=this
//   wx.chooseMedia({
//     sourceType: ['album'],
//     success(res) {
//       that.setCanvasShape(res.tempFiles[0].width, res.tempFiles[0].height,lable_info,video_info)
//       i_this.setData({
//         'video_info.url': res.tempFiles[0].tempFilePath
//       });
//       console.log(res.tempFiles[0].tempFilePath)
//       that.canvasWait(canvas)
//     }
//   });
// }

// module.exports = {
//   canvasWait:canvasWait,
//   setVideo:setVideo,
//   setCanvasShape:setCanvasShape
// }
