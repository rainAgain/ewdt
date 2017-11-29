/*!
 * 弹出框
 * author: xiaolong
 */

(function() {

    var data = {
        name: "Sean",
        age: 18
    };

    $("#iframe").click(function() {
        layer.open({
            type: 2,
            title: "订阅提醒设置",
            shift: 5,
            area: ['950px', '450px'],
            content: 'iframe.html',
            success: function(layero, index) {
                var body = layer.getChildFrame('body', index),
                    iframeName = layero.find('iframe')[0].name,
                    iframeWin = window[iframeName]; //得到iframe页的窗口对象

                // 执行iframe页的方法,传递参数给子页面，需要在子页面上定义此方法
                if(iframeWin.setData) {
                	iframeWin.setData(data);
                }
            }
        });
    });

    $("#alert").click(function() {
        layer.alert("上传图片大小不能超过5M", {
            title: "提示信息",
            icon: 0,
            area: ['370px', "160px"]
        });
    });

    $("#confirm").click(function() {
        layer.confirm("<p class='confirm-sub-title'>确定注销本订阅号？</p><p class='confirm-sub-content'>注销后的订阅号及其内容将被清除</p>", {
            title: "操作确认",
            icon: 3,
            area: ['480px', "210px"],
            btn: ['确定', '取消']
        }, function() {
            alert("确认");
        }, function() {

        });
    });

    $("#prompt").click(function() {
        layer.prompt({
            content: "<p class='confirm-sub-title'>注销理由：</p><textarea class='layui-layer-input'></textarea><p class='confirm-sub-content'>注销后的订阅号及其内容将被清除</p>",
            formType: 2,
            title: "操作确认",
            area: ['480px', "300px"]
        }, function(value, index, elem) {
            alert(value);
        });
    });

})();