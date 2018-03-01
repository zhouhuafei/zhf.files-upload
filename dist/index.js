'use strict';

var extend = require('zhf.extend');
var getDomArray = require('zhf.get-dom-array');

function ImgUpload(opts) {
    this.opts = extend({
        input: null,
        limitNum: 5, // 一次上传限制几张图片
        // 选择图片的回调
        changeCallback: function changeCallback() {
            console.log('no find changeCallback');
        },
        // 把图片读取成base64编码的回调
        base64Callback: function base64Callback() {
            console.log('no find base64Callback');
        }
    }, opts);
    // 如果没有选择文件的input,则不继续往下执行
    if (!this.opts.input) {
        console.log('no find input');
        return;
    }
    // 初始化
    this.init();
}

ImgUpload.prototype.init = function () {
    // 渲染结构
    this.render();
    // 渲染功能
    this.power();
};
ImgUpload.prototype.render = function () {};
ImgUpload.prototype.power = function () {
    // 事件相关
    this.events();
};
ImgUpload.prototype.events = function () {
    this.eventsInputChange();
};
ImgUpload.prototype.eventsInputChange = function () {
    var self = this;
    var limitNum = this.opts.limitNum;
    var input = getDomArray(this.opts.input)[0];
    input.addEventListener('change', function () {
        var imagesNum = 0;
        // 图片的相关信息
        self.imgData = [];
        var files = this.files;
        var len = files.length;
        for (var i = 0; i < len; i++) {
            var f = files[i];
            var isImages = /image/ig.test(f.type);
            // 是图片
            if (isImages) {
                if (imagesNum < limitNum) {
                    // 小于限制几张图片的数量
                    self.imgData.push(f);
                    imagesNum++;
                } else {// 大于限制几张图片的数量

                }
            }
        }
        self.opts.changeCallback({ imgData: self.imgData });
        // 把图片读成base64编码
        self.fileReadAsDataURL(self.imgData);
    });
};
ImgUpload.prototype.fileReadAsDataURL = function (imgData) {
    var self = this;
    imgData.forEach(function (v, i) {
        var fileRender = new FileReader();
        fileRender.readAsDataURL(v);
        fileRender.addEventListener('load', function () {
            self.opts.base64Callback({ base64: this.result, index: i });
        });
    });
};
module.exports = ImgUpload;