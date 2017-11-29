/*！
 * 查询条件列表
 * date:2017-09-28
 * author: xiaol;
 */

(function() {

    var $resourceListCnt = $("#resource-list"),
        $pager = $("#pager");

    var optionTpl = Util.getTplInstance('option-tpl'), //条件模板实例
        listTpl = Util.getTplInstance('list-tmpl'); //列表模板实例

    var defaultPageSize = Config.PAGE_SIZE, // 默认分页大小
        pageIndex = '0', // 默认页码
        sortField = "", // 排序字段
        sortOrder = "desc", // 排序方式，降序desc，升序asc
        resourcesName = "", // 资源关键字
        resourceSubject = "", // 资源数据领域分类
        registDepartGuid = ""; // 资源机构guid

    // 获取查询参数
    function getQuery() {
        var query = {}; // 获取资源列表的查询参数

        $.extend(query, {
            currentPage: pageIndex,
            pageSize: defaultPageSize,
            sortField: sortField,
            sortOrder: sortOrder,
            resourcesName: resourcesName,
            resourceSubject: resourceSubject,
            registDepartGuid: registDepartGuid
        });

        return query;
    }

    // 获取查询条件
    function getDataArea() {
        return Util.ajax({
            url: Config.ajaxUrls.getOption,
            data: {
                classifyType: 'resourcesType'
            }
        });
    }

    // 获取资源列表
    function getResourceList() {
        var query = getQuery();
        return Util.ajax({
            url: Config.ajaxUrls.loadListData,
            data: query
        });
    }

    // 获取资源并渲染数据
    function excuteResourceList() {
        Util.showLoading();

        getResourceList().done(function(data) {
            Util.hideLoading();
            data = data.custom;
            renderResourceList(data);
            renderPager(pageIndex, data.total);
        });
    }

    // 生成分页
    function renderPager(pageindex, total) {
        if ($pager.pagination()) {
            $pager.pagination('setPageIndex', pageindex);
            $pager.pagination('render', total);
        } else {
            $pager.pagination({
                pageSize: defaultPageSize - 0,
                total: total,
                pageIndex: pageindex
            });

            $pager.on("pageClicked", function(event, data) {
                // 分页按钮点击事件
                pageIndex = data.pageIndex;
                excuteResourceList();
            });
        }
    }

    // 渲染资源列表
    function renderResourceList(data) {
        // console.log(data);
        $resourceListCnt.empty();
        if (data && data.resourceList && data.resourceList.length) {
            for (var i = 0, l = data.resourceList.length; i < l; i++) {
                data.resourceList[i].order = i + 1;

                switch (data.resourceList[i].resultScore) {
                    case 0:
                        data.resourceList[i].starcls = '';
                        break;
                    case 1:
                        data.resourceList[i].starcls = 'score-1';
                        break;
                    case 2:
                        data.resourceList[i].starcls = 'score-2';
                        break;
                    case 3:
                        data.resourceList[i].starcls = 'score-3';
                        break;
                    case 4:
                        data.resourceList[i].starcls = 'score-4';
                        break;
                    case 5:
                        data.resourceList[i].starcls = 'score-5';
                        break;
                    default:
                        data.resourceList[i].starcls = '';
                }
            }
            listTpl.setView(data).renderTo('resource-list');
            $("#list-total").text(data.total);
        }
    }

    // 渲染提供机构、数据领域
    function renderOptionPanel(data, target) {
        // console.log(data);
        var $target = $("#" + target);

        if (data) {
            optionTpl.setView({ subList: data }).renderTo(target);
            // 增加一个全部选项
            $target.prepend('<li class="list-option-item active" data-id="">全部</li>');
            // 控制展开按钮是否显示
            var height = $target.height();
            if (height > 33) { // 大于1行
                $target.next().removeClass('hidden');
            }
        }
    }

    // 绑定事件
    function bindEvent() {

        var $sortSelect = $("#sort-select"),
            $resourcename = $("#resourcename"),
            $listOptionWrap = $("#list-option"),
            $searchBtn = $("#search-bar-icon");

        // 条件面板展开事件
        $listOptionWrap.on('click', '.btn-toggle', function(event) {
            var $this = $(this),
                $panel = $this.closest('.list-option-panel'),
                $selectItem = $panel.find('.active');

            $panel.toggleClass('expand');

            // 如果是收缩，调整激活的位置到可见区域
            if ($panel.hasClass('expand')) { // 展开
                $panel.find(".list-options").css('margin-top', 0);
                $this.text('收起');
            } else { // 收起
                var top = $selectItem.position().top;
                $panel.find(".list-options").css('margin-top', -top);
                $this.text('展开');
            }
        });

        // 筛选数据领域和提供机构
        $listOptionWrap.on('click', '.list-option-item', function(event) {
            var $this = $(this),
                $container = $this.closest('.list-options'),
                type, guid;

            if (!$this.hasClass('active')) {
                if ($container.length) {
                    type = $container[0].id;
                    guid = $this.data('id');

                    $this.addClass('active')
                        .siblings().removeClass('active');

                    if (type === 'data-area') { // 数据领域
                        resourceSubject = guid;
                    } else if (type === 'provide-dep') { // 提供机构
                        registDepartGuid = guid;
                    }
                }

                pageIndex = '0';
                excuteResourceList();
            }
        });

        // 初始化下拉框
        $sortSelect.chosen({
            disable_search: true
        });

        // 选择排序
        $sortSelect.on('change', function(evt, params) {
            var selected = params.selected,
                order, field;

            switch (selected) {
                case '1':
                    order = 'asc';
                    field = 'vistcnt';
                    break;
                case '2':
                    order = 'desc';
                    field = 'vistcnt';
                    break;
                case '3':
                    order = 'asc';
                    field = 'registdate';
                    break;
                case '4':
                    order = 'desc';
                    field = 'registdate';
                    break;
                case '5':
                    order = 'asc';
                    field = 'resultscore';
                    break;
                case '6':
                    order = 'desc';
                    field = 'resultscore';
                    break;
                default:
                    order = 'desc';
                    field = '';
            }

            sortField = field;
            sortOrder = order;
            pageIndex = 0;
            excuteResourceList();
        });

        // 搜索关键字
        $searchBtn.on('click', function(event) {
            var key = $.trim($resourcename.val());

            resourcesName = key;
            pageIndex = 0;
            excuteResourceList();
        });

        $resourcename.on('keyup', function(event) {
            if (event.which === 13) {
                $searchBtn.trigger('click');
            }
        });
    }

    // 初始化页面
    function initPage() {
        Util.showLoading();
        $.when(getDataArea(), getResourceList())
            .done(renderData);
    }

    // 初始化生成页面视图
    function renderData(data1, data2) {
        Util.hideLoading();
        var optionData = data1.custom,
            listData = data2.custom;

        renderResourceList(listData);
        renderOptionPanel(optionData.departList, 'data-area');
        renderOptionPanel(optionData.subjectList, 'provide-dep');
        renderPager(0, listData.total);
        bindEvent();
        $("#main").removeClass('invisible');
    }

    initPage();

})();