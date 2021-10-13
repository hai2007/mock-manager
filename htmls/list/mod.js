ctrlapp.register.controller('ListController', ['$scope', function ($scope) {

    $scope.initMethod = function () {

        $scope.datalist = [];

        // 获取列表
        $.ajax({
            url: 'handler',
            type: "POST",
            success: function (data) {

                var datalist = [];
                for (var key in data) {
                    var temp = key.split('@');
                    datalist.push({
                        method: temp[0],
                        url: temp[1],
                        remark: data[key]
                    });
                }

                $scope.datalist = datalist;
                $scope.$apply();

            }
        });

    };

    $scope.delete = function (url, method) {

        if (confirm('确定删除吗？')) {

            // 删除数据
            $.ajax({
                url: 'delete?url=' + url + "&method=" + method,
                type: "POST",
                complete: function () {

                    // 删除记录
                    $.ajax({
                        url: 'handler?url=' + url + "&method=" + method + "&type=delete",
                        type: "POST",
                        complete: function () {

                            alert('温馨提示：数据删除成功，稍后立刻刷新页面！');
                            window.location.reload();

                        }
                    });

                }
            });
        }



    };

    $scope.toOperate = function (type, url, method, remark) {
        $scope.goto('Home.Operate', {
            type: type,
            url: url,
            method: method,
            remark: remark
        });
    };

}]);
