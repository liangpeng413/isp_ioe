function queryListTaskPage($scope, $http) {
    $scope.longToStr = window.longToStr;
    $scope.page = window.defaultPageParam ? window.defaultPageParam : {};

    $scope.query = function (pageNumber) {
        var pageNumber = pageNumber || $scope.page.currPage;
        var body = {
            //原来取activityType的id，现在id含义变了？，要传activityType。
            activityType: $scope.queryTask.type ? $scope.queryTask.type.activityType : "",
            channel: $scope.queryTask.channel || "",
            status: $scope.queryTask.status,
            activityName: $scope.queryTask.activityName || "",
            startTime: $("#startTime").val() ? strToDate($("#startTime").val()).getTime() : "",
            endTime: $("#endTime").val() ? strToDate($("#endTime").val()).getTime() : "",
            isEnable: $scope.queryTask.isEnable,
            isStick: $scope.queryTask.isStick,
            moduleCode: $scope.queryTask.moduleCode,
            pageNo: pageNumber,
            pageSize: $scope.page.perPageRowSize
        };
        console.log("查询的条件");
        console.log(body);
        $scope.page.currPage = pageNumber;
        $http.post(globalConfig.basePath + "/router/web/activity/list", body).then(function (result) {
            var data = result.data.resp.data;
            $scope.queryList = data.activityList;
            console.log($scope.queryList);
            setPage(data.totalCount, data.totalPage);
        })
    };

    $scope.reset = function () {
        $scope.queryTask = {channel: ""};
        $scope.queryData = {type: ""};
        $scope.types = [];
        $scope.moduleList = [];
        $("#startTime").val("");
        $("#endTime").val("");
        $scope.page.fetchPageContent = $scope.query;
        $http.get(globalConfig.basePath + "/router/web/activity/type/list?channel=" + $scope.queryTask.channel)
            .then(
                function (response) {
                    var data = response.data.resp.data;
                    var types = [];
                    $.each(data.activityTypeList, function (n, v) {
                    	 types.push(v);
                       /* if (v.name === '赠送类') {
                            types.push(v);
                        }*/
                    });
                    $scope.types = types;
                    $scope.queryData.types = $scope.types;
                    // $scope.queryTask = {type: $scope.queryData.types[0]};
                }
            );
    };

    function setPage(totalSize, totalPage) {
        $scope.page.totalRowSize = totalSize;
        $scope.page.lastPage = totalPage;
        $scope.page.startRow = $scope.page.currPage === 1 ? 1 : ($scope.page.currPage - 1) * $scope.page.perPageRowSize + 1;
        $scope.page.endRow = $scope.page.startRow + $scope.queryList.length - 1;
    }


    $scope.reset();
    $scope.query();
}
