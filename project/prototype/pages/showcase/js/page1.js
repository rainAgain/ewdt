(function($) {
    console.log('this is page1');

    Util.loadWidget({
        css: 'chosen/chosen.css',
        js: 'chosen/chosen.jquery.min.js'
    }).done(function() {
        console.log('chosen is loaded');
    });

    Util.ajax({
        url: Config.ajaxUrls.getUserInfo,
        data: {
            userguid: '2983-3kd93jd-3938dj-kd93kd0-kdld'
        },
        success: function(data) {
            // 渲染模板
            Util.getTplInstance('user-tpl')
                .setView(data.custom)
                .renderTo('main');
        }
    });
}(jQuery));
