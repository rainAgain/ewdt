/*!
 * 上传页面
 * author: xiaolong
 */

(function(win, $) {

    // guid用来展示上传文件时如何携带参数
    // 实际项目可能是上传到对应某个guid材料的附件
    var guid = "1234",
        LOCALUPLOADTYPE = "本地上传";

    var M = Mustache,
        fileTmpl = Util.getTplStr('fileitem-tpl'),
        $fileList = $("#file-list");

    // 图片类型上传时的缩略图尺寸
    var thumbnailWidth = 76,
        thumbnailHeight = 48;

    // TODO 请配置上传控件的配置项
    var extensions = 'gif,jpg,jpeg,bmp,png,doc,docx,xlsx', // 允许上传的文件类型
        fileSingleSize = 20480000, // 单个文件的大小，单位B
        fileNum = 3; // 上传总数

    var FILEEXCEDSIZEMSG = '文件尺寸不能超过' + getSize(fileSingleSize, 0) + '!',
        FILENUMEXCEDMSG = '文件数量不能超过' + fileNum + '个！',
        FILETYPEEXCEDMSG = '不支持该文件类型！';

    // 配置初始化上传控件
    var uploader = WebUploader.create({

        // 选完文件后，是否自动上传。
        auto: true,

        // swf文件路径，ie9及以下使用的是flash上传。
        swf: '../../js/widgets/webuploader/Uploader.swf',

        // 文件接收服务端。
        server: Config.ajaxUrls.uploadServer,

        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#file-picker',

        // 配置允许选择的文件类型。
        accept: {
            extensions: extensions
        },

        // 单个文件大小限制
        fileSingleSizeLimit: fileSingleSize,

        // 文件总数限制
        fileNumLimit: fileNum
    });

    // 文件上传前，添加参数
    uploader.on('uploadBeforeSend', function(object, data) {
        data.guid = guid; // 上传附件携带的参数guid
    });

    // 当有文件添加进来的时候，生成文件列表视图
    uploader.on('filesQueued', function(files) {
        var $item, $img, ext;

        // 文件列表数据添加
        for (var i = 0, len = files.length; i < len; i++) {
            files[i].attachname = files[i].name;
            files[i].attachsource = LOCALUPLOADTYPE;
            files[i].attachsize = getSize(files[i].size, 2);
        }

        $item = $(M.render(fileTmpl, { attachlist: files }));
        $img = $item.find('img');
        $fileList.append($item);

        // 创建缩略图
        // 如果为非图片文件，可以不用调用此方法。
        // thumbnailWidth x thumbnailHeight 为 76 x 48
        for (i = 0; i < len; i++) {
            ext = files[i].ext;
            if (isImage(ext)) {
                makeThumb(files[i], $img.eq(i));
            } else {
                setFileIcon(ext, $img.eq(i));
            }
        }
    });

    // 创建缩略图
    function makeThumb(file, img) {
        uploader.makeThumb(file, function(error, src) {
            if (error) {
                img.replaceWith('<span>不能预览</span>');
                return;
            }

            img.attr('src', src);
        }, thumbnailWidth, thumbnailHeight);
    }

    // 创建文件图标
    function setFileIcon(ext, img) {
        switch (ext) {
            case 'doc':
            case 'docx':
                img.attr('src', 'css/images/word.png');
                break;
            case 'xlsx':
                img.attr('src', 'css/images/excel.png');
                break;
        }
    }

    // 获得文件大小，以M和K为单位
    function getSize(size, digit) {
        var K = 1024,
            M = 1048576;

        if (size > M) {
            return (size / M).toFixed(digit) + "M";
        } else {
            return (size / K).toFixed(digit) + "K";
        }
    }

    // 判断是否图片
    function isImage(ext) {
        var imgarr = ['gif', 'jpg', 'jpeg', 'bmp', 'png'];
        return $.inArray(ext, imgarr) >= 0 ? true : false;
    }

    // 开始上传时，显示进度条
    uploader.on('uploadStart', function(file) {
        var $item = $('#' + file.id),
            $progressbar = $('.cs-uploader-barwrap', $item);

        $progressbar.show();
    });

    // 文件上传过程中创建进度条实时显示。
    uploader.on('uploadProgress', function(file, percentage) {
        var $item = $('#' + file.id),
            $percent = $item.find('.progress-text'),
            $width = $item.find('.progress-body');

        $percent.text(percentage * 100 + '%');
        $width.css('width', percentage * 100 + '%');
    });

    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on('uploadSuccess', function(file, res) {
        var $item = $('#' + file.id);

        $item.addClass('upload-state-done');
        $item.find('.cs-uploader-error').html('').hide();

        if (res.custom) {
            // 把服务端返回的attachguid设置到对应的dom上
            if (res.custom.attachguid) {
                $item.attr('fileServerId', res.custom.attachguid);
            }

            // 把服务端返回的文件缩略图设置到对于的img上
            if (res.custom.attachsrc) {
                $item.find('img').attr('src', res.custom.attachsrc);
            }
        }
    });

    // 文件上传失败，显示上传出错。
    uploader.on('uploadError', function(file) {
        var $item = $('#' + file.id),
            $error = $item.find('.cs-uploader-error');

        $error.html('上传出错!').show();
    });

    // validate不通过
    uploader.on('error', function(type) {
        switch (type) {
            case 'Q_EXCEED_NUM_LIMIT':
                layer.msg(FILENUMEXCEDMSG);
                break;
            case 'F_EXCEED_SIZE':
                layer.msg(FILEEXCEDSIZEMSG);
                break;
            case 'Q_TYPE_DENIED':
                layer.msg(FILETYPEEXCEDMSG);
                break;
        }
    });

    // 完成上传完了，成功或者失败，先删除进度条。
    uploader.on('uploadComplete', function(file) {
        $('#' + file.id).find('.cs-uploader-barwrap').remove();
    });

    // 绑定文件列表中的点击事件
    $fileList.on('click', '.cs-uploader-remove', function() {
        var $item = $(this).closest('.cs-uploader-item'),
            fileId = $item[0].id,
            serverid = $item.attr('fileServerId');

        if (fileId) {
            uploader.removeFile(fileId);
            if (!serverid) {
                $item.remove();
            }
        }

        // 有fileServerId则表示改文件已上传成功了，需要发ajax告诉服务端文件已删除
        if (serverid) {
            // 发ajax告诉后台文件已删除
            removeServerFile(serverid, $item);
        }
    });

    // 材料附件删除
    function removeServerFile(id, $item) {
        Util.ajax({
            url: Config.ajaxUrls.delFile,
            data: { attachguid: id },
            success: function(data) {
                data = data.custom;
                if (data.text === "") {
                    // 移出dom   
                    $item.remove();
                    layer.msg("删除成功！");
                } else {
                    layer.msg(data.text);
                }
            }
        });
    }

})(this, jQuery);