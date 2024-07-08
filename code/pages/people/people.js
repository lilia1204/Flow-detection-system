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
    video_info:{
      'url':'',//视频路径
      'width':'',//视频在画布上展示时的宽度
      'height':'',//视频在画布上展示时的高度
    },    
    base64:'../../image/empty.png',//图片路径
    color:'',//拥挤程度字体颜色
    lev:'等待检测',//当前拥挤程度
    num:'#', //当前车辆数
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
    cvs.width = w * dpr;
    cvs.height = h * dpr;

    //清空画布
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    //开始绘制视频帧到画布上
    ctx.drawImage(that.data.video, 0,0,w*dpr,h*dpr);


    // 绘制完成后，将画布内容转换为 base64
    wx.canvasToTempFilePath({
      canvas: cvs,
      success: res => {
        const tempFilePath = res.tempFilePath;
        wx.getFileSystemManager().readFile({
          filePath: tempFilePath,
          encoding: 'base64',
          success: res => {
            this.peo(res.data)
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

    /*
  函数功能：初始化视频与画布变量
  参数：无
  */
  onLoad() {
    this.canvasInit()
    this.videoInit()
  },

  // 上传检测视频
  chooseVideo(){
    const that=this
    that.data.pauseFlag=false
    wx.chooseMedia({
      sourceType: ['album'],
      success(res) {
        that.setData({
          'video_info.url': res.tempFiles[0].tempFilePath,
          'video_info.width':res.tempFiles[0].width,
          'video_info.height':res.tempFiles[0].height,
          base64:'../../image/empty.png',
          num:'#',
          lev:'等待检测',
          color:''
        });
      }
    });
  },

  //初始化画布
  canvasInit() {
    const that = this
    wx.createSelectorQuery().selectAll('#cvs1').node(res => {
      const canvas = res[0].node;
      that.data.canvas['cvs'] = canvas
      that.data.canvas['ctx'] = canvas.getContext('2d');
      // common.canvasWait(that.data.canvas)
    }).exec();
  },

  //初始化视频
  videoInit() {
    const that = this
    wx.createSelectorQuery().select('#video').context(res => {
      that.data.video = that.video = res.context;
    }).exec();
  },


  //图片检测人流量
  peo(base64code) {
    const that = this
    wx.request({
      url: 'https://aip.baidubce.com/rest/2.0/image-classify/v1/body_num?access_token=' + app.access_token_peo,
      method: 'POST', //请求的方式
      data: {
        'image': base64code,
        'show':'true'
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        console.log(res.data.person_num) 
        var num=res.data.person_num,color='',lev='' 
        const base64　= 'data:image/jpeg;base64,' + res.data.image

        if(num>=app.peo_lev[2]){
          lev='严重拥挤'
          color='color:#ad2e00'
        }else if(num>=app.peo_lev[1]){
          lev='中度拥挤'
          color='color:#ad5c00'
        }else if(num>=app.peo_lev[0]){
          lev='轻度拥挤'
          color='color:#f29955'
        }else{
          lev='畅通'
          color='color:#91f20a'
        }


        that.setData({
          base64:base64,
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
