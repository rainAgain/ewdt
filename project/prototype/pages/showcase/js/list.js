/*！
*常规列表页面
*date:2017-09-26
*author: chengang;
*/

(function($) {
    var $searchform = $("#search-form"),    //查询条件
        $infolist = $("#infolist"),         //记录容器
        $pager = $("#pager");               //分页容器

    var tplInstance = Util.getTplInstance('infolist-tpl');  //模板实例

    //请求数据
    var requestData = function(pageindex, pagesize) {
        //参数
        var param = {
            pageindex: pageindex,
            pagesize: pagesize
        };
        $.extend(param, $searchform.toFormData());

        Util.ajax({
            url: Config.ajaxUrls.loadListData,
            data: param,
            beforeSend: function() {
                Util.showLoading();
            },
            success: function(data) {
                data = data.custom;
                renderData(data);
                renderPager(pageindex, pagesize, data.total);
                Util.hideLoading();
            }
        });

    };

    //渲染数据
    var renderData = function(data) {
        tplInstance.setView(data).renderTo($infolist[0]);
    };

    //渲染分页
    var renderPager = function(pageindex, pagesize, total) {
        if ($pager.pagination()) {
            $pager.pagination('setPageIndex', pageindex);
            $pager.pagination('setPageSize', pagesize);
            $pager.pagination('render', total);
        }
        else {
            $pager.pagination({
                pageIndex: pageindex,
                pageSize: pagesize,
                total: total
            });
            $pager.on("pageClicked", function(event, data) {
                requestData(data.pageIndex, data.pageSize);
            }).on('jumpClicked', function(event, data) {
                requestData(data.pageIndex, data.pageSize);
            });
        }

    };

    //首次加载
    requestData(0, Config.PAGE_SIZE);

    //搜索
    $searchform.on("click", ".btn-search", function() {
        requestData(0, Config.PAGE_SIZE);
    });

    //绑定删除事件
    $infolist.on("click", ".btndel", function() {
        var guid = $(this).closest("tr").data("guid");
        layer.confirm('确定删除该记录吗？', {
            btn: ['确定', '取消'] //按钮
        }, function() {
            Util.ajax({
                url: Config.ajaxUrls.deleteByGuid,
                data: { "guid": guid },
                success: function(data) {
                    data = data.custom;
                    layer.msg((data.success ? "删除成功！" : data.message), {
                        icon: (data.success ? 1 : 2),
                        time: 3000
                    });
                }
            });
        }, function() {

        });
    });
}(jQuery));
