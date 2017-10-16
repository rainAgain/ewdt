/*!
 * 弹出子页面
 * author: xiaolong
 */

(function() {

	// 获取父页面数据，可以用来初始化界面
    function setData(data) {
        $("#setdata").append("我是父页面的数据：" + "name: " + data.name + " age: " + data.age);
    }

    // 注意：parent 是 JS 自带的全局对象，可用于操作父页面
    var index = parent.layer.getFrameIndex(window.name); //获取窗口索引

    // 在父层弹出一个层
    $('#new').on('click', function() {
        parent.layer.msg('Hi, man', { shade: 0.3 });
    });

    // 给父页面传值
    $('#transmit').on('click', function() {
    	var value = "已弹出页";
        parent.$('#iframe').val(value);
        parent.layer.tips('Look here', '#iframe', { time: 5000 });
        parent.layer.close(index);
    });

    // 关闭iframe
    $('#closeIframe').click(function() {
        var val = $('#name').val();
        if (val === '') {
            parent.layer.msg('请填写标记');
            return;
        }
        parent.layer.msg('您将标记 [ ' + val + ' ] 成功传送给了父窗口');
        parent.layer.close(index);
    });


    window.setData = setData;
})();