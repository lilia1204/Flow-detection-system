const app = getApp().globalData

Page({
  data: {
    video: '',
    canvas:{//画布
      'ctx':'',
      'cvs':''
    },
    pauseFlag:false,//当前是否时暂停检测
    timer: '',//定时器
    lable_info:{
      'height':400,//画布高度
      'width':700,//画布宽度
      'ratio':700/400//画布宽高比
    },
    video_info:{
      'url':'',//视频路径
      'width':'',//视频帧在画布上展示时的宽度
      'height':'',//视频帧在画布上展示时的高度
      'dx':0,//视频帧在画布上展示时的横偏移量
      'dy':0,//视频帧在画布上展示时的纵偏移量
    },   
    color:'',//拥挤程度字体颜色
    lev:'等待检测',//当前拥挤程度
    num:'#', //当前车辆数
  },


  /*
  函数功能：初始化视频与画布变量
  参数：无
  */
  onLoad() {
    //初始化画布
    const that = this
    wx.createSelectorQuery().selectAll('#cvs1').node(res => {
      const canvas = res[0].node;
      that.data.canvas['cvs'] = canvas
      that.data.canvas['ctx'] = canvas.getContext('2d');
      that.canvasWait()
    }).exec();

    //初始化视频变量
    wx.createSelectorQuery().select('#video').context(res => {
      that.data.video = that.video = res.context;
    }).exec();
  },


  /*函数功能：每隔2秒，截取一帧，画到画布上并进行处理 */
  monitor() {
    this.data.pauseFlag=false
    this.draw()
    clearInterval(this.data.timer);
    this.data.timer = setInterval(() => {
      this.draw()
    }, 1000);
  },

  /* 将视频帧画到画布上，之后将画布上的图片转为base64编码，再调用接口进行检测 */
  draw() {
    const that = this;
    const dpr = wx.getSystemInfoSync().pixelRatio;
    const w = that.data.video_info
    ['width'];
    const h = that.data.video_info['height'];
    const cvs = that.data.canvas['cvs']
    const ctx=that.data.canvas['ctx']

    // 设置画布宽高
    cvs.width = that.data.lable_info['width'] * dpr;
    cvs.height = that.data.lable_info['height'] * dpr;

    //清空画布
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    //开始绘制视频帧到画布上
    ctx.drawImage(that.data.video, 
      that.data.video_info['dx'] * dpr, 
      that.data.video_info['dy'] * dpr, 
      w * dpr
      , h * dpr);


    // 绘制完成后，将画布内容转换为 base64
    wx.canvasToTempFilePath({
      canvas: cvs,
      success: res => {
        const tempFilePath = res.tempFilePath;
        wx.getFileSystemManager().readFile({
          filePath: tempFilePath,
          encoding: 'base64',
          success: res => {
            this.car(res.data)
          },
          fail: err => {
            console.error('Failed to read file as base64', err);
          }
        });
      },
      fail: err => {
        console.error('Failed to convert canvas to temp file', err);
      }
    }, this);

  },


  /*函数功能：停止检测 */
  stop() {
    clearInterval(this.data.timer);
    this.data.pauseFlag=true
    this.data.video.pause();
  },

  //函数功能：上传视频，并计算出如果视频抽帧后，如何在固定尺寸的画布上展示，即计算出缩放/放大后的视频帧尺寸以及x,y偏移量
  setVideo: function () {
    const that=this
    that.data.pauseFlag=false
    wx.chooseMedia({
      sourceType: ['album'],
      success(res) {
        that.setCanvasShape(res.tempFiles[0].width, res.tempFiles[0].height)
        that.setData({
          'video_info.url': res.tempFiles[0].tempFilePath,
          num:'#',
          lev:'等待检测',
          color:''
        });
        that.canvasWait()
      }
    });
  },


  //函数功能：计算出如果视频抽帧后，如何在固定尺寸的画布上展示，即计算出缩放/放大后的视频帧尺寸以及x,y偏移量
  setCanvasShape(w,h){
    const lable_info=this.data.lable_info
    const video_info=this.data.video_info
    const lw = lable_info['width']
    const lh = lable_info['height']
    if (w / h > lable_info['ratio']) {//偏宽
      video_info['width'] = lw
      video_info['dx'] = 0
  
      video_info['height'] = lw * h / w
      video_info['dy'] = (lh - video_info['height']) / 2
    } else {//偏高
      video_info['height'] = lh
      video_info['dy'] = 0
  
      video_info['width'] = lh * w / h
      video_info['dx'] = (lw - video_info['width']) / 2
    }
  },


  //函数功能：当暂停检测或者没有视频时画布上展示结果
  canvasWait(){
    const ctx=this.data.canvas['ctx']
    const cvs=this.data.canvas['cvs']

    const dpr = wx.getSystemInfoSync().pixelRatio;
    cvs.width = this.data.lable_info['width'] * dpr;
    cvs.height = this.data.lable_info['height'] * dpr;
  
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.fillStyle = '#f5f2d7';
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    ctx.font = '150px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('检测屏幕', 250*dpr, 180*dpr);
    ctx.fillText('等待检测', 250*dpr, 250*dpr);
  },


  //函数功能：车辆检测并展示
  car(base64code) {
    const that = this
    wx.request({
      url: 'https://aip.baidubce.com/rest/2.0/image-classify/v1/vehicle_detect?access_token=' + app.access_token_car,
      method: 'POST', //请求的方式
      data: {
        'image': base64code
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {

        const num=res.data.vehicle_info.length
        let color,lev;
        const ctx=that.data.canvas['ctx']
        ctx.strokeStyle = 'red'
        ctx.lineWidth = 5;
        for (let value of res.data.vehicle_info) {
          ctx.strokeRect(value.location.left + that.data.video_info['dx'], 
          value.location.top + that.data.video_info['dy'], 
          value.location.width, 
          value.location.height);
        }
        if(num>=app.car_lev[2]){
          lev='严重拥挤'
          color='color:#ad2e00'
        }else if(num>=app.car_lev[1]){
          lev='中度拥挤'
          color='color:#ad5c00'
        }else if(num>=app.car_lev[0]){
          lev='轻度拥挤'
          color='color:#f29955'
        }else{
          lev='畅通'
          color='color:#91f20a'
        }
        this.setData({
          lev:lev,
          color:color,
          num:num
        })

        if(!that.data.pauseFlag) that.data.video.play();
      },
      fail: (res) => {
        console.log(res)
      }
    })
  },
});