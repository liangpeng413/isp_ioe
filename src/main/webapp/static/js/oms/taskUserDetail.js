function queryListTaskUserDetailPage($scope, $http) {
    $scope.longToStr = window.longToStr;
    $scope.page = window.defaultPageParam ? window.defaultPageParam : {};

    $scope.query = function (pageNumber) {
        alert("user detail query");
        var pageNumber = pageNumber || $scope.page.currPage;
        var body = {
            activityType: $scope.queryUserDetail.type ? $scope.queryUserDetail.type.id : "",
            channel: $scope.queryUserDetail.channel || "",
            status: $scope.queryUserDetail.status,
            activityName: $scope.queryUserDetail.activityName || "",
            startTime: $("#startTime").val() ? strToDate($("#startTime").val()).getTime() : "",
            endTime: $("#endTime").val() ? strToDate($("#endTime").val()).getTime() : "",
            isEnable: $scope.queryUserDetail.isEnable,
            pageNo: pageNumber,
            pageSize: $scope.page.perPageRowSize
        };
        alert(body.startTime);
        $scope.page.currPage = pageNumber;
        $http.post(globalConfig.basePath + "/router/web/activity/list", body).then(function (result) {
            alert("user detail post 接口");
            var data = result.data.resp.data;
            $scope.queryList = data.activityList;
            setPage(data.totalCount, data.totalPage);
        })
    };

    $scope.reset = function () {
        $scope.queryUserDetail = {channel: ""};
        $scope.queryData = {type: ""};
        $scope.types = [];
        $("#startTime").val("");
        $("#endTime").val("");
        $scope.page.fetchPageContent = $scope.query;
        $http.get(globalConfig.basePath + "/router/web/activity/type/list")
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
                    $scope.queryData.types = [{name: "全部", id: ""}].concat($scope.types);
                    $scope.queryUserDetail = {type: $scope.queryData.types[0]};
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
