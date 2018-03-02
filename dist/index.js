'use strict';

var extend = require('zhf.extend');
var getDomArray = require('zhf.get-dom-array');

function FilesUpload(opts) {
    this.opts = extend({
        input: null,
        limitNum: 5, // 一次性上传的数量
        maxSize: 2 * 1024 * 1024, // 单个文件最大2M
        // 超出限制的回调
        overLimitCallback: function overLimitCallback() {
            console.log('no find overLimitCallback');
        },
        // 选择图片的回调
        changeCallback: function changeCallback() {
            console.log('no find changeCallback');
        },
        // 每次把图片读取成base64的编码时都会调用这个
        base64CallbackItem: function base64CallbackItem() {
            console.log('no find base64CallbackItem');
        },
        // 所有图片都读取成base64的编码时会调用这个
        base64CallbackAll: function base64CallbackAll() {
            console.log('no find base64CallbackAll');
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

FilesUpload.prototype.init = function () {
    // 渲染结构
    this.render();
    // 渲染功能
    this.power();
};
FilesUpload.prototype.render = function () {};
FilesUpload.prototype.power = function () {
    // 事件相关
    this.events();
};
FilesUpload.prototype.events = function () {
    this.eventsInputChange();
};
FilesUpload.prototype.eventsInputChange = function () {
    var self = this;
    var opts = this.opts;
    var limitNum = opts.limitNum;
    var maxSize = opts.maxSize;
    var input = getDomArray(opts.input)[0];
    input.addEventListener('change', function () {
        var filesNum = 0;
        // 图片的相关信息
        var imgData = [];
        var files = this.files;
        var len = files.length;
        var overLimitData = [];
        for (var i = 0; i < len; i++) {
            filesNum++;
            var currentFile = files[i];
            var size = currentFile.size;
            if (filesNum > limitNum || size > maxSize) {
                // 大于限制几张图片的数量 大于最大限制的数量
                overLimitData.push({ limitNum: limitNum, filesNum: filesNum, size: size, maxSize: maxSize, file: currentFile, index: i });
            } else {
                imgData.push(currentFile);
            }
        }
        opts.changeCallback(imgData);
        opts.overLimitCallback(overLimitData);
        self.fileReadAsDataURL(imgData); // 把图片读成base64编码
    });
};
FilesUpload.prototype.fileReadAsDataURL = function (imgData) {
    var self = this;
    var opts = self.opts;
    var num = 0;
    var base64Result = [];
    imgData.forEach(function (v, i) {
        var fileRender = new FileReader();
        fileRender.readAsDataURL(v);
        fileRender.addEventListener('load', function () {
            num++;
            opts.base64CallbackItem({ base64: this.result, index: i });
            base64Result.push({ base64: this.result, index: i });
            if (num === imgData.length) {
                opts.base64CallbackAll(base64Result);
            }
        });
    });
};
module.exports = FilesUpload;