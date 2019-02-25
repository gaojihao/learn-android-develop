<template>
  <div>
    <div class="vue-uploader" @touchstart="empty">
      <div class="upload-img-preview">
        <ul class="upload-list">
          <li v-for="(file, index) of files" class="file-item draggable-item" :style="'background-image: url('+ file.src + ')'" @click="previewClick(file, index)" ondragstart="return false;">
            <span class="file-remove" @click.stop="remove(index)">+</span>
            <div class="progress-bar" v-if="file.error || file.percent < 100">
              <div v-if="file.error" @click.stop="retry( file)">重新上传</div>
              <div v-if="!file.error && file.percent < 100">{{file.percent}}%</div>

            </div>
          </li>
        </ul>
        <div v-if="isCreate" tabindex="0"  class="addBottom" @click="add">
          <img :src="addpic">
          <span v-if="addType=='bg'">圈子封面</span>
          <span v-if="addType=='head'">圈子头像</span>
          <input type="file" name="file" @change="fileChanged" ref="file" multiple accept="image/*"  :capture="inputCapture" >
        </div>
        <div v-if='!isCreate' tabindex="0" class="upload-file-item" @click="add">
          <i class="fa fa-plus"></i>
          <input type="file" name="file" @change="fileChanged" ref="file" multiple accept="image/*"  :capture="inputCapture" >
        </div>
      </div>
    </div>
    <fade>
      <gallary v-if="showGallary" :imgs="images" :activeIndex="activeIndex" @close="handleGallaryClose"></gallary>
    </fade>
    <div class="cropper-content"  v-if="showCropper">
      <div class="cropper">
        <vueCropper
                ref="cropper"
                :img="cropper.img"
                :outputSize="cropper.size || defaultCropper.size"
                :outputType="cropper.outputType || defaultCropper.outputType"
                :info="true"
                :canMove="cropper.canMove || defaultCropper.canMove"
                :canMoveBox="cropper.canMoveBox || defaultCropper.canMoveBox"
                :canScale="cropper.canScale || defaultCropper.canScale"
                :original="cropper.original || defaultCropper.original"
                :autoCrop="cropper.autoCrop || defaultCropper.autoCrop"
                :autoCropWidth="cropper.autoCropWidth || defaultCropper.autoCropWidth"
                :autoCropHeight="cropper.autoCropHeight || defaultCropper.autoCropHeight"
                :fixedBox="cropper.fixedBox || defaultCropper.fixedBox"
                @imgLoad="cropperImgLoad">
        </vueCropper>
        <div class="cropper-btn">
          <mt-button type="default" @click="cancelCropper">返回</mt-button>
          <mt-button type="default" @click="rotateCropper">旋转90°</mt-button>
          <mt-button type="primary" @click="commitCropper">确认</mt-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import Gallary from '~/components/common/gallary.vue'
import Fade from '~/components/common/fade.vue'
import { Toast } from 'mint-ui'
import utils from '~/utils/utils'
import api from '~/api'
import VueCropper from 'vue-cropper'
import exif from "exif-js";

export default {
    components: {
        Gallary,
        Fade,
        VueCropper
    },

    props: {
        src: {
            type: String,
            required: true
        },
        max: {
            type: String
        },
        maxFileSize: {
            type: Number,
            default: function () {
                return 1024 * 1024 * 10
            }
        },
        isCreate:{
          type:Boolean
        },
        usingCropper: {
            type:Boolean,
            default: function () {
                return false;
            }
        },
        cropper: {
            type: Object,
            default: function () {
                return this.defaultCropper
            }
        },
        addType:{
          type:String,
        }
    },

    computed: {
        images:  function () {
            let images = [];
            if(this.files && this.files.length){
                return this.files.map(function (item) {
                    return item.src;
                })
            }
            return images;
        },


        inputCapture: function () {
            let ua = navigator.userAgent.toLowerCase();
            let isIos = (ua.indexOf('iphone') !== -1) || (ua.indexOf('ipad') !== -1);
            if (isIos) {
                return null;
            }

            return 'camera'
        }
    },

    data() {
        return {
            status: 'ready',
            files: [],
            point: {},
            uploading: false,
            showGallary:false,
            activeIndex : 1,
            addpic:require('../assets/images/group/addpic.png'),
            showCropper: false,
            cropperItem: null,
            defaultCropper: {
                  img: '',
                  size: 1,
                  full: false,
                  outputType: 'png',
                  canMove: true,
                  fixedBox: true,
                  original: false,
                  canMoveBox: true,
                  autoCrop: true,
                  // 只有自动截图开启 宽度高度才生效
                  autoCropWidth: 150,
                  autoCropHeight: 150,
                  centerBox: false,
                  high: true,
                  canScale: true,
              },

        }
    },
    methods: {
        empty(){

        },
        add() {
            this.$refs.file.click()
        },
        previewClick (file, index) {
            this.activeIndex = index
            this.showGallary = true
        },
        handleGallaryClose () {
            this.showGallary = false
        },

        finished() {
            this.files = []
            this.status = 'ready'
        },

        remove(index) {
            this.files.splice(index, 1);

            let filesObj = this.getFiles();

            this.$emit('updateFiles', filesObj)

            return false;
        },

        getFiles(){
            let finish = true;
            let finishList = [];
            this.files.map(function (f) {
                if(f.status === 'finished'){
                    finishList.push(f);
                }else{
                    finish = false
                }
            })

            return {
                files: finishList,
                finish: finish
            }
        },

        retry( item){
            item.percent = 0;
            this.uploadTask(item)
        },

        uploadTask(item){
            let that = this;
            const formData = new FormData()
            if(!item.base64){
                return;
            }

            formData.append("base64RC",  item.base64.split(',')[1]);
            formData.append("fileName", item.name);

            const xhr = new XMLHttpRequest()

            xhr.upload&& xhr.upload.addEventListener('progress', function(evt){
                that.uploadProgress(evt, item)
            }, false)

            let config = require(`../config/index`)
            let url = config.baseUrl + `/pucrc/uploadBase64RC`;
            xhr.open('POST', url, true)
            item.uploading = true
            item.error =  false;
            let timeout = setTimeout( function () {
                xhr.abort();
                item.error =  true;
                let filesObj = that.getFiles();
                that.$emit('updateFiles', filesObj)
            }, 20*1000);

            xhr.send(formData)
            xhr.onload = () => {

                item.uploading = false

                clearTimeout(timeout)

                if (xhr.status === 200 || xhr.status === 304) {

                    let res = JSON.parse(xhr.responseText);
                    let data = res.data;

                    if(res.status === 500 || !data.url){
                        item.error =  true;
                        let filesObj = that.getFiles();
                        that.$emit('updateFiles', filesObj)
                        return;
                    }

                    item.status = 'finished';
                    item.url = data.url;

                    let filesObj = that.getFiles();

                    that.$emit('updateFiles', filesObj)

                } else {
                    item.error =  true;
                    let filesObj = that.getFiles();
                    that.$emit('updateFiles', filesObj)
                    console.log(`error：error code ${xhr.status}`)
                }
            }
        },

        async fileChanged() {
            let that = this;
            const list = this.$refs.file.files
            if(this.max){
                if(this.files.length + list.length > this.max){
                    Toast({
                        message: `最多可以上传${this.max}张`,
                    });
                    this.$refs.file.value = ''
                    return
                }
            }

            if(this.usingCropper){
                if(list.length > 1){
                    Toast({
                        message: `每次只能选择1张图片`,
                    });
                    this.$refs.file.value = ''
                    return
                }
            }

            if(this.maxFileSize !== -1){
                for (let i = 0; i < list.length; i++) {
                    if(list[i].size > this.maxFileSize){
                        Toast({
                            message: `图片最大不能超过${utils.toFixed(this.maxFileSize / 1024 / 1024, 0)}MB`,
                        });
                        this.$refs.file.value = ''
                        return
                    }
                }
            }

            for (let i = 0; i < list.length; i++) {
                if (!this.isContain(list[i])) {
                    const item = {
                        name: list[i].name,
                        size: list[i].size,
                        file: list[i],
                        percent: 0,
                    }

                    that.html5Reader(list[i], item).then(function () {

                        if(that.usingCropper){
                            that.showCropper = true;
                            that.cropperItem = item;
                            that.cropper.img = item.base64;

                        }else{
                            that.uploadTask(item);
                            that.files.push(item)
                            let filesObj = that.getFiles();
                            that.$emit('updateFiles', filesObj)
                        }
                    });
                }
            }

            this.$refs.file.value = ''
        },

        // 将图片文件转成BASE64格式
        html5Reader(file, item){
            let that = this;
            return new Promise(function (resolve, reject) {
                const reader = new FileReader()
                reader.onload = (e) => {
                    let image = new Image();
                    image.src = e.target.result;
                    image.onload = function() {
                        if(file.size > 1024 * 500){
                            item.base64 = that.resizeMe(image);
                        }else{
                            item.base64 = e.target.result;
                        }

                        that.adjustOrientation(item.base64, image).then(function (base64) {
                            that.$set(item, 'src', base64)
                            resolve(item)
                        })
                    }
                }
                reader.readAsDataURL(file)
            });
        },

        adjustOrientation(base64, image){
            return new Promise(function (resolve, reject) {
                let img = new Image();
                img.src = base64;
                img.onload = function() {
                    let width = img.width;
                    let height = img.height;
                    let rotate = 0;
                    let canvas = document.createElement("canvas");
                    let ctx = canvas.getContext("2d");
                    let dw = 0
                    let dh = 0
                    let x = 0
                    let y = 0
                    ctx.save();
                    exif.getData(image, () => {
                        exif.getAllTags(image);
                        let orientation = exif.getTag(image, "Orientation");
                        switch (orientation) {
                            case 6:
                                rotate = 1;
                                break;
                            case 8:
                                rotate = -1;
                                break;
                            case 3:
                                rotate = 3;
                                break;
                            default:
                                rotate = 0;
                        }

                        let max = 2000
                        if (rotate === 0 && width < max & height < max ) {
                            resolve(base64);
                            return;
                        }

                        if (width > max) {
                            height = height / width * max
                            width = max
                        }

                        if (height > max) {
                            width = width / height * max
                            height = max
                        }

                        switch (rotate) {
                            case 1:
                            case -3:
                                // 旋转90度 或者-270度 宽度和高度对调
                                canvas.width = height;
                                canvas.height = width;
                                ctx.rotate(rotate * 90 * Math.PI / 180);
                                dw = width
                                dh = height
                                y = -height

                                ctx.drawImage(img, x, y, dw, dh);
                                ctx.restore();
                                let data = canvas.toDataURL("image/jpeg", 1)
                                resolve(data);
                                break;
                            default:
                                resolve(base64);
                        }

                    });
                }
            });

        },

        resizeMe (img) {
            //压缩的大小
            let max_width = 1920;
            let max_height = 1080;

            let canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            if(width > height) {
                if(width > max_width) {
                    height = Math.round(height *= max_width / width);
                    width = max_width;
                }
            }else{
                if(height > max_height) {
                    width = Math.round(width *= max_height / height);
                    height = max_height;
                }
            }

            canvas.width = width;
            canvas.height = height;

            let ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            //压缩率
            let ndata = canvas.toDataURL("image/jpeg", 0.7)
            let initSize = img.src.length;

            console.log('压缩前：' + initSize);
            console.log('压缩后：' + ndata.length);
            console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");

            return ndata;
       },

        isContain(file) {
            return this.files.find((item) => item.name === file.name && item.size === file.size)
        },

        uploadProgress(evt, item) {

            //console.log(evt)
            if (evt.lengthComputable) {
                const percentComplete = Math.round((evt.loaded * 100) / evt.total)
                item.percent = percentComplete
            } else {
                console.warn('upload progress unable to compute')
            }
        },

        reset(){
            this.files = [];
        },

        cancelCropper(){
            this.showCropper = false;
            this.cropperItem = null;
        },

        commitCropper(){

            let that = this;
            this.$refs.cropper.getCropData((data) => {

                let item = that.cropperItem;
                item.base64 = data;
                that.$set(item, 'src', data)
                that.uploadTask(item);
                that.files.push(item);
                let filesObj = that.getFiles();
                that.$emit('updateFiles', filesObj)

                that.showCropper = false;
            })
        },

        cropperImgLoad(e){
          if(e === 'error'){
              this.$refs.cropper.refresh();
          }
        },

        rotateCropper(){
            this.$refs.cropper.rotateRight();
        }
    }
}
</script>
<style lang="scss">
@import  '../pages/theme.scss';
  .vue-uploader {
  }
  .vue-uploader .file-list {
    padding: 10px 0;
  }
  .vue-uploader .file-list:after {
    content: '';
    display: block;
    clear: both;
    visibility: hidden;
    line-height: 0;
    height: 0;
    font-size: 0;
  }
  .vue-uploader input[type="file"] {
    display: none;
  }

  .upload-img-preview{
    padding: 10px;
    .upload-list{
      margin: 0;
      display: inline;
      padding: 0;
      vertical-align: top;
      list-style: none;
    }

    .upload-file-item{
      background-color: #fbfdff;
      border: 1px dashed #c0ccda;
      border-radius: 6px;
      box-sizing: border-box;
      width: 148px;
      height: 148px;
      line-height: 146px;
      vertical-align: top;
      display: inline-block;
      text-align: center;
      cursor: pointer;

      i{
        color: #8c939d;
        font-size: 32px;
        -webkit-text-stroke:2px white;
        background:white;
      }
    }

    .addBottom{
      display:inline-block;
      width:90px;
      height:90px;
      overflow:hidden;
      box-shadow:$itemShadow;
      box-sizing: border-box;
      vertical-align: top;
      border-radius:5px;
      margin-bottom:8px;
      img{
        display:block;
        width:25px;
        height:21px;
        margin:22px auto 11px;
      }
      span{
        display:block;
        text-align:center;
        color:#999;
        font-size:12px;
      }
      input{

      }
    }

    .addBottom:hover{
      border-color: #409EFF;
      color: #409EFF;
    }

    .upload-file-item:hover{
      border-color: #409EFF;
      color: #409EFF;
    }

    .file-item{
      overflow: hidden;
      background-color: #fff;
      border: 1px solid #c0ccda;
      border-radius: 6px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 148px;
      height: 148px;
      margin: 0 8px 8px 0;
      display: inline-block;
      position: relative;

      .file-remove {
        position: absolute;
        right: 2px;
        display: inline;
        z-index: 3;
        top: 2px;
        width: 14PX;
        height: 14PX;
        color: white;
        cursor: pointer;
        line-height: 14PX;
        border-radius: 50%;
        transform: rotate(45deg);
        text-align: center;
        background: rgba(0, 0, 0, 0.5);
      }
    }

    .upload-file-item,
    .file-item{
      width: 90px;
      height: 90px;
      line-height: 98px;
      background-size: cover;
      background-position: 50% 50%;
    }

    .progress-bar{
      position:absolute;
      top:0;
      bottom:0;
      right:0;
      left:0;
      z-index:2;
      background:#000;
      opacity:0.5;
      color:#fff;
      text-align:center;
      line-height:150rpx;
    }
  }

.cropper-content{
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  z-index: 99;
  display: flex;
  display: -webkit-flex;
  justify-content: flex-end;
  -webkit-justify-content: flex-end;

  .cropper{
    width: 100%;
    height: 80%;
  }
  .show-preview{
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    -webkit-justify-content: center;
    .preview{
      overflow: hidden;
      border-radius: 50%;
      border:1px solid #cccccc;
      background: #cccccc;
      margin-left: 40px;
    }
  }
}

.cropper-btn{
  padding: 10px;
  margin: 20px auto;
  text-align: center;
  display: flex;
  justify-content: space-around;
}
</style>
