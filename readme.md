# 文件上传
```
const FilesUpload = require('zhf.files-upload');
new FilesUpload({
    input: '.input',
    limitNum: 5, // 一次性上传的数量
    limitSize: 2 * 1024 * 1024, // 单个文件最大2M
    overLimitCallback: function (data) {
        console.log('overLimitCallback', data);
    },
    // 选择图片的回调
    changeCallback: function (data) {
        console.log('changeCallback', data);
    },
    // 每次把图片读取成base64的编码时都会调用这个
    base64CallbackItem: function (data) {
        console.log('base64CallbackItem', data);
    },
    // 所有图片都读取成base64的编码时会调用这个
    base64CallbackAll: function (data) {
        console.log('base64CallbackAll', data);
        data.forEach(function (v) {
            const img = document.createElement('img');
            img.src = v.base64;
            document.body.appendChild(img);
        });
    },
});
```
