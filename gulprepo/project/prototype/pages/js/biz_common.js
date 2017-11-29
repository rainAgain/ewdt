(function($) {
    //业务全局变量扩展
    $.extend(Config, {
        PAGE_SIZE: 10       //每页记录数
    });

    // 运行非框架层面的
    Util.runCommon();

    //业务全局变量扩展
    $.extend(Config, {
        PAGE_SIZE: 10 //每页记录数
    });

    // 适配老的规范
    Util.overwrite('ajaxParamsHandler', function(data) {
        return JSON.stringify(data);
    });

    var $header = $('#header'),
        $footer = $('#footer');

    var headerInc = $header.length ? Util.getIncInstance($header[0].id, 'pages/_include/header.inc.html') : null;
    var footerInc = $footer.length ? Util.getIncInstance($footer[0].id, 'pages/_include/footer.inc.html') : null;

    if (headerInc) {
        headerInc.fetch(function(el, html) {
            var $html = $(html);
            //高亮菜单
            var pagename = /pages\/(\w+\/\w+\.html)/i.exec(window.location.toString())[1],
                $curr_a = $("a[href*='" + pagename + "']", $html);

            if ($curr_a.length) {
                $curr_a.addClass("active").closest("li").addClass("active");
            }
            return $html.prop('outerHTML');

        });
    }

    if (footerInc) {
        footerInc.fetch(function() {
            console.log('footer is loaded');
        });
    }
}(jQuery));
