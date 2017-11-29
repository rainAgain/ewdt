console.log('this is test page1 code');

Mock.mock(Config.ajaxUrls.mock.getUserInfo, {
    custom: {
        username: '@cname',
        department: '@cword(6,8)'
    },
    status: {
        code: 1,
        text: '请求成功'
    }
});
