var phoneStart = ["130", "131", "132", "133", "134", "135", "136", "137", "138", "139",
    "145", "147", "150", "151", "152", "153", "155", "156", "157", "158", "159",
    "180", "181", "182", "183", "184", "185", "186", "187", "188", "189"
];

function RandNum(min, max) {
    var range = max - min;
    var rnd = Math.random();
    return (min + Math.round(rnd * range));
}


function RandPhoneNumber() {
    var idx = RandNum(0, phoneStart.length - 1);
    var str = phoneStart[idx];
    for (var i = 1; i <= 8; i++) {
        str += (RandNum(0, 9) + "");
    }
    return str;
}
Mock.mock(Config.ajaxUrls.mock.loadListData, function(options) {
    var params = JSON.parse(options.body);
    var pageIndex = params.pageindex || 0,
        pageSize = params.pagesize || 10;
    console.dir(params);
    return {
        controls: [],
        custom: {
            total: 1000,
            resourceList: (function() {
                var result = [];
                for (var i = 1; i <= pageSize; i++) {
                    result.push({
                        rowGuid: Mock.mock('@guid'),
                        resourcesName: Mock.mock('@cname'),
                        provideDepartName: Mock.mock('@city'),
                        resultScore: Mock.mock("@integer(0,5)"),
                        vistCnt: Mock.mock("@integer(1,1000)"),
                        registDate: Mock.mock('@date("yyyy年MM月dd日")')
                    });
                }
                return result;
            })()
        },
        status: {
            code: 1,
            text: "",
            url: ""
        }
    };
});

Mock.mock(Config.ajaxUrls.mock.getOption, {
    controls: [],
    custom: {
        subjectList: [{
            itemtext: "市档案局",
            itemvalue: "12",
            resourcecount: 2
        }, {
            itemtext: "市安监局",
            itemvalue: "13",
            resourcecount: 3
        }],
        departList: [{
            itemtext: "婚育收养",
            itemvalue: "12",
            resourcecount: 2
        }, {
            itemtext: "教育培训",
            itemvalue: "13",
            resourcecount: 3
        }, {
            itemtext: "劳动就业",
            itemvalue: "12",
            resourcecount: 2
        }, {
            itemtext: "社会保障",
            itemvalue: "13",
            resourcecount: 3
        }, {
            itemtext: "医疗卫生",
            itemvalue: "12",
            resourcecount: 2
        }, {
            itemtext: "死亡殡葬",
            itemvalue: "13",
            resourcecount: 3
        }, {
            itemtext: "民族宗教",
            itemvalue: "12",
            resourcecount: 2
        }, {
            itemtext: "出境入境",
            itemvalue: "13",
            resourcecount: 3
        }, {
            itemtext: "职业资格",
            itemvalue: "12",
            resourcecount: 2
        }, {
            itemtext: "行业标准",
            itemvalue: "13",
            resourcecount: 3
        }]
    },
    status: {
        code: 1,
        text: "",
        url: ""
    }
});
