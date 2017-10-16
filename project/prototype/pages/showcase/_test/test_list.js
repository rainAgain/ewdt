var phoneStart = ["130", "131", "132", "133", "134", "135", "136", "137", "138", "139",
    "145", "147", "150", "151", "152", "153", "155", "156", "157", "158", "159",
    "180", "181", "182", "183", "184", "185", "186", "187", "188", "189"];

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
Mock.mock(Config.ajaxUrls.loadListData, function(options) {
    var params = JSON.parse(options.body);
    var pageIndex = params.pageindex || 0,
        pageSize = params.pagesize || 10;
    console.dir(params);
    return {
        controls: [],
        custom: {
            total: 1000,
            records: (function() {
                var result = [];
                for (var i = 1; i <= pageSize; i++) {
                    result.push(
                        {
                            guid: Mock.mock('@guid'),
                            id: (pageIndex * pageSize + i).toString(),
                            name: Mock.mock('@cname') + params.name,
                            sex: Mock.mock('@boolean()'),
                            class: Mock.mock("@integer(1,10)") + "班",
                            phonenumber: RandPhoneNumber(),
                            birthday: Mock.mock('@date("yyyy年MM月dd日")'),
                            address: Mock.mock("@county(true)") + params.address
                        });
                };
                return result;
            })()



        },
        status: {
            code: 200,
            text: "",
            url: ""
        }
    }
});

Mock.mock(Config.ajaxUrls.deleteByGuid, {
    controls: [],
    custom: {
        success: '@boolean()',
        message: "无法删除，该记录已被关联"
    },
    status: {
        code: 200,
        text: "",
        url: ""
    }
});