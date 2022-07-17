app.controller("couponDetailController", ['$scope','$http', function ($scope,$http) {
    var self = $scope;
    self.search = {};// 查询

    //条件查询
    self.querySendCouponList = function(pageNum){

        if(!pageNum){
            self.search.pageNo = self.page.pageNo;
        } else {
            if(pageNum >= self.search.pageCount){
                if(self.search.pageCount==0){
                    self.search.pageCount=1;
                }
                self.search.pageNo =self.search.pageCount;
            }else{
                self.search.pageNo = pageNum;
            }
        }
        self.search.batchNumber=self.couponGiveBatchNo;
        var url = globalConfig.basePath+"/issue/coupon/pageIssueCouponList";
        $http.post(url,self.search).then(
            function(data){
                if(data.data.code=='000'){
                    self.search.pageNo = data.data.resp.currentPage;
                    self.search.pageSize = data.data.resp.pageSize+"";
                    self.search.pageCount = data.data.resp.pageCount;
                    self.search.totalRowSize = data.data.resp.totalRowSize;
                    self.sendCouponList = data.data.resp.result;

                }else{
                    alert(data.data.message)
                }
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    //初始化加载
    self.querySendCouponList(1);

    /**
     * 接收子作用域数据
     */
    self.$on('couponDetailsShow', function(n) {
        self.search={};
        //初始化查询
        self.querySendCouponList(1);
    })

    //发送端按钮
    self.returnCouponBatchPage = function () {
        self.$emit("couponBatchPageShow");
    }

    //重置
    self.reset = function(){
        self.search={};
        $("#startTime").val("");
        $("#endTime").val("");
        self.search.pageNo = "1";
        self.search.pageSize = "5";
    }

    //数据导出
    self.importList = function () {
        var form = $('#conditionForm');
        form.attr("action",globalConfig.basePath + "/issue/coupon/importList");
        form.attr("target","downloadIframe");
        form.submit();
    }

}]);
