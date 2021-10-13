ctrlapp.register.controller('OperateController', ['$scope', '$stateParams', function ($scope, $stateParams) {

    $scope.initMethod = function () {

        $scope.params = $stateParams;

        // 如果不是新增，就需要初始化数据
        if ($scope.params.type != 'add') {
            $scope.url = decodeURIComponent($scope.params.url);
            $scope.method = $scope.params.method;
            $scope.remark = $scope.params.remark;

            $scope.initReadonly($scope.params.type == 'update' || $scope.params.type == 'query', $scope.params.type == 'update' || $scope.params.type == 'query', $scope.params.type == 'query');

            $.ajax({
                url: 'oralquery?url=' + $scope.url + "&method=" + $scope.method,
                type: "POST",
                success: function (data) {

                    $scope.initEidtor(data, $scope.params.type == 'query');

                }
            });

        }

        // 新增
        else {
            $scope.method = "GET";
            $scope.initEidtor("(function(){\n" +
                "\n" +
                "    // 在这里，你就可以写一些语句了\n" +
                "    // 当然，你也可以借助Mock生成随机数据\n" +
                "    \n" +
                "    return {\n" +
                "       // 返回你的数据\n" +
                "    };\n" +
                "\n" +
                "})()\n", false);
        }

    };

    $scope.initReadonly = function (url, method, remark) {
        if (url) document.getElementById('url').setAttribute('readonly', 'true');
        if (method) {
            var methods = document.getElementsByName('method');
            for (var i = 0; i < methods.length; i++) methods[i].setAttribute('disabled', 'true');
        }
        if (remark) document.getElementById('remark').setAttribute('readonly', 'true');
    };

    $scope.initEidtor = function (content, readonly) {
        $scope.editor = new OpenWebEditor({
            el: document.getElementById('editor'),
            readonly: readonly,
            color: {
                background: readonly ? "#e5ecf2" : "white",
                /*编辑器背景*/
                text: "#170",
                /*文本颜色*/
                number: "#888484",
                /*行号颜色*/
                edit: "#eaeaf1",
                /*编辑行背景色*/
                cursor: "#ff0000",
                /*光标颜色*/
                select: "#6c6cf1",
                /*选择背景*/
            },
            content: content,
            shader: ['javascript', {
                "text": "#000000",
                /*文本颜色*/
                "annotation": "#6a9955",
                /*注释颜色*/
                "insign": "#555",
                /*符号颜色*/
                "key": "#ff0000",
                /*关键字颜色*/
                "string": "#ac4c1e",
                /*字符串颜色*/
                "funName": "#1e50b3",
                /*函数名称颜色*/
                "execName": "#1e83b1" /*执行方法颜色*/
            }]
        });
    };

    // 提交
    $scope.doSubmit = function () {

        // 先保存数据
        $.ajax({
            url: 'update?url=' + $scope.url + '&method=' + $scope.method,
            type: "POST",
            data: $scope.editor.valueOf(),
            success: function () {

                // 然后进行登记
                $.ajax({
                    url: 'handler?url=' + $scope.url + '&method=' + $scope.method + "&type=update",
                    type: "POST",
                    data: $scope.remark,
                    complete: function () {

                        alert('温馨提示：操作成功，即将返回列表页！');
                        $scope.goto('Home.List');

                    }
                });

            },
            error(e) {
                if (e.status == "501")
                    alert('您提交的数据可能危害到服务器，因此请求被拒绝了。');
                else
                    alert(e.responseText);
            }
        });

    };

    // 打开模拟数据地址
    $scope.openMockDataPage = function () {
        var url = document.getElementById('link-data-url').innerText.trim();
        var aDom = document.createElement('a');
        aDom.setAttribute('href', url);
        aDom.setAttribute('target', '_blank');
        aDom.click();
    };

}]);
