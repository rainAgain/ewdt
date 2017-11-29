/*！
*表单页面
*date:2017-09-27
*author: chengang;
*/
(function($) {
    var guid = Util.getUrlParams("guid");

    var $createform = $("#createform"),      //表单
        $selclass = $("#selclass", $createform);

    //美化表单
    var initForm = function() {
        $(':radio,:checkbox', $createform).iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue'
        });
        laydate.render({
            elem: '#birthday',
            showBottom: false,
            format: 'yyyy年MM月dd日'
        });

        $selclass.chosen({
            disable_search: true
        });
    };

    //验证表单
    var validator = $createform.validate({
        errorPlacement: function(error, element) {
            $(element).closest(".form-item").append($(error));
        },
        ignore: "",
        rules: {
            name: {
                required: true,
                minlength: 2,
                maxlength: 5,
                nowhitespace: true
            },
            birthday: {
                required: true
            },
            class: {
                required: true
            },
            phonenumber: {
                required: true,
                phonenumber: true
            }
        },
        messages: {
            name: {
                required: "请输入姓名",
                minlength: "不能少于2个字符",
                maxlength: "不能超过5个字符",
                nowhitespace: "不能包含空格"
            },
            birthday: {
                required: "请选择日期"
            },
            class: {
                required: "请选择班级"
            },
            phonenumber: {
                required: "请输入手机号",
                phonenumber: "手机号不正确"
            }
        },
        submitHandler: function() {
            if (!$createform.valid()) {
                return;
            }
            var params = $createform.toFormData();
            Util.ajax({
                url: Config.ajaxUrls.postData,
                data: params,
                success: function(data) {
                    data = data.custom;
                    layer.msg(data.success ? "保存成功！" : data.message);
                }
            })
        }
    });

    //获取班级下拉框数据
    var loadClassList = function() {
        Util.ajax({
            url: Config.ajaxUrls.loadClassData,
            success: function(data) {
                data = data.custom;
                $.each(data, function(i, e) {
                    $selclass.append("<option value='" + e.value + "'>" + e.text + "</option>");
                });
                if (guid) {    //修改
                    loadData();
                } else {        //新增
                    initForm();
                }
            }
        });
    };

    //加载数据
    var loadData = function() {
        Util.ajax({
            url: Config.ajaxUrls.loadDataByGuid,
            data: { "guid": guid },
            success: function(data) {
                data = data.custom;
                $createform.loadFormData(data);
                initForm();
            }
        });
    };
    loadClassList();
}(jQuery));
