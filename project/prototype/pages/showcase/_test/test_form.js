
Mock.mock(Config.ajaxUrls.loadClassData, {
    controls: [],
    'custom|10': [{
        'value|+1': 1,
        "text": "@integer(1,10)" + "班",
    }],
    status: {
        code: 200,
        text: "",
        url: ""
    }
});

Mock.mock(Config.ajaxUrls.loadDataByGuid, {
    controls: [],
    custom: {
        'guid': '@guid',
        "name": "@cname",
        "sex": "@boolean",
        "birthday": "@date('yyyy年MM月dd日')",
        "class": "@integer(1,10)",
        "phonenumber": "13812345678",
        "address": "@county(true)",
        "hobby": ['1', '2', '3'],
        "profile": "个人简介个人简介个人简介个人简介个人简介个人简介个人简介个人简介"

    },
    status: {
        code: 200,
        text: "",
        url: ""
    }
});

Mock.mock(Config.ajaxUrls.postData, {
    controls: [],
    custom: {
        success: '@boolean()',
        message: "未知错误"
    },
    status: {
        code: 200,
        text: "",
        url: ""
    }
});