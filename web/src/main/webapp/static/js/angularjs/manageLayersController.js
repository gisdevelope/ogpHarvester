(function() {
	'use strict';

	angular.module('ogpHavester.controllers.manageLayersCtrl',
        ['ogpHarvester.services', 'ngRoute', 'ui.bootstrap', 'pascalprecht.translate', 'smart-table'])

	.config(['$routeProvider',
		function config($routeProvider) {
			$routeProvider.when('/manageLayers', {
				template: 'resources/layerList.html',
				controller: 'ManageLayersCtrl'
			});
		}
	])

        .controller('ManageLayersCtrl', ['$scope', '$http', '$translate', '$modal', '$route', '$window', '__env',
            function ($scope, $http, $translate, $modal, $route, $window, __env) {

        	var dataIngestURL = __env.dataIngestAPIUrl;
            $scope.itemsByPage = 12;
            $scope.jsonresult = [];
            $scope.displayedCollection = [].concat($scope.jsonresult);
            $scope.actions = [$translate("MANAGE_LAYERS.DOWNLOAD"),
                $translate("MANAGE_LAYERS.DELETE")];

            $scope.GetValue = function (action, row_name) {
                 var res = row_name.split(":");
                $scope.ws=res[0];
                $scope.ds= res[1];
                switch(action) {
                    case $translate("MANAGE_LAYERS.DOWNLOAD"):
                        /*
                        download(dataIngestURL + "/workspaces/" +
                            $scope.ws + "/datasets/" + $scope.ds + "/download");
                            */

                        var newWindow = $modal.open({
                            templateUrl: 'resources/splash.html',
                            scope: $scope,
                            controller: 'downloadWindowCtrl',
                            resolve: {
                                url: function () {
                                    return dataIngestURL + "/workspaces/" +
                                        $scope.ws + "/datasets/" + $scope.ds + "/download";
                                },
                                layer_title: function (){
                                    return $scope.ws + ":" + $scope.ds;
                                },
                                msg: function () {
                                    return $translate('SPLASH.DOWNLOAD');
                                }
                            },
                        });

                        break;
                     case $translate("MANAGE_LAYERS.DELETE"):
                        confirmDlg();
                        }
                    this.ddlActions = '';
            }
            ;

            $http({
                method : "GET",
                //url : "http://localhost:8083/allDatasets",
                url : dataIngestURL + "/workspaces/db/datasets",//TODO: remove this from production
                isArray: true
            }).then(function mySuccess(response) {
                $scope.jsonresult = response.data;
            }, function myError(response) {
                $scope.jsonresult = response.statusText;
            });

            $scope.layerDetails = function (row_name) {
                var res = row_name.split(":");
                $scope.ws=res[0];
                $scope.ds= res[1];
                var splash = $modal.open({
                    animation: true,
                    templateUrl: 'resources/splash.html',
                    keyboard: false,
                    backdrop: 'static',
                    scope: $scope,
                    controller: 'SplashCtrl',
                    resolve: {
                        msg: function () {
                            return $translate('SPLASH.DETAILS');
                        },
                        layer_title: function (){
                            return $scope.ws + ":" + $scope.ds;
                        }
                    },
                });
                    var modalInstance = $modal.open({
                    templateUrl: 'resources/popup.html',
                    controller: 'PopupCtrl',
                    resolve: {
                        jsonresp:function(){
                            return $http({
                                method : "GET",
                                url : dataIngestURL + "/workspaces/" + $scope.ws + "/datasets/" + $scope.ds,
                                isArray: true
                            }).success(function (response) {
                                splash.close();
                            }).error(function(response){
                                splash.close();
                                $scope.details = response.statusText;
                            });
                        }
                    }
                });
            }


            function download(url){
                console.log("url");
                $window.open('resources/splash.html', '_blank');
            }


            function confirmDlg (options) {
                var deferredObject = $.Deferred();
                var defaults = {
                    type: "confirm", //alert, prompt,confirm
                    modalSize: 'modal-sm', //modal-sm, modal-lg
                    okButtonText: 'Ok',
                    cancelButtonText: 'Cancel',
                    yesButtonText: 'Yes',
                    noButtonText: 'No',
                    headerText: "You are about to remove '" + $scope.ws + ":" + $scope.ds + "'",
                    messageText: 'Are you sure you want to remove this dataset?',
                    alertType: 'danger', //default, primary, success, info, warning, danger
                }
                $.extend(defaults, options);

                var _show = function(){
                    var headClass = "alert-danger";
                    $('BODY').append(
                        '<div id="ezAlerts" class="modal fade">' +
                        '<div class="modal-dialog" class="' + defaults.modalSize + '">' +
                        '<div class="modal-content">' +
                        '<div id="ezAlerts-header" class="modal-header ' + headClass + '">' +
                        '<button id="close-button" type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>' +
                        '<h4 id="ezAlerts-title" class="modal-title">Modal title</h4>' +
                        '</div>' +
                        '<div id="ezAlerts-body" class="modal-body">' +
                        '<div id="ezAlerts-message" ></div>' +
                        '</div>' +
                        '<div id="ezAlerts-footer" class="modal-footer">' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>'
                    );

                    $('.modal-header').css({
                        'padding': '15px 15px',
                        '-webkit-border-top-left-radius': '5px',
                        '-webkit-border-top-right-radius': '5px',
                        '-moz-border-radius-topleft': '5px',
                        '-moz-border-radius-topright': '5px',
                        'border-top-left-radius': '5px',
                        'border-top-right-radius': '5px'
                    });

                    $('#ezAlerts-title').text(defaults.headerText);
                    $('#ezAlerts-message').html(defaults.messageText);

                    var keyb = "false", backd = "static";
                    var calbackParam = "";

                    var btnhtml = '<button id="ezok-btn" class="btn btn-primary">' + defaults.noButtonText + '</button>';

                    if (defaults.yesButtonText && defaults.yesButtonText.length > 0) {
                        btnhtml += '<button id="ezclose-btn" class="btn btn-default">' + defaults.yesButtonText + '</button>';
                    }
                    $('#ezAlerts-footer').html(btnhtml).on('click', 'button', function (e) {
                        if (e.target.id === 'ezok-btn') {//false
                            calbackParam = false;
                            //console.log("cancel");
                            $('#ezAlerts').modal('hide');
                        } else if (e.target.id === 'ezclose-btn') {//true
                            calbackParam = true;
                            $('#ezAlerts').modal('hide');
                        }
                    });

                    $('#ezAlerts').modal({
                        show: false,
                        backdrop: backd,
                        keyboard: keyb
                    }).on('hidden.bs.modal', function (e) {
                        $('#ezAlerts').remove();
                        deferredObject.resolve(calbackParam);
                        deferredObject.then(function(calbackParam){
                            if(calbackParam) {
                                var message = "helloworld";
                                var splash = $modal.open({
                                    animation: true,
                                    templateUrl: 'resources/splash.html',
                                    keyboard: false,
                                    backdrop: 'static',
                                    scope: $scope,
                                    controller: 'SplashCtrl',
                                    resolve: {
                                        msg: function () {
                                            return $translate('SPLASH.DELETE');
                                        },
                                        layer_title: function (){
                                            return $scope.ws + ":" + $scope.ds;
                                        }
                                    },

                                });
                                $http({
                                    method : "DELETE",
                                    url : dataIngestURL + "/workspaces/" + $scope.ws + "/datasets/" + $scope.ds
                                }).then(function mySuccess(response) {
                                    console.log(response.status + ": OK. Successfully deleted '" +
                                        $scope.ws + ":" + $scope.ds + "'");
                                    $route.reload();
                                    splash.close();
                                }, function myError(response) {
                                    console.log(response.statusText);
                                    splash.close();
                                });

                            }
                        });

                    }).on('shown.bs.modal', function (e) {
                        if ($('#prompt').length > 0) {
                            $('#prompt').focus();
                        }
                    }).modal('show');
                }

                _show();
                return deferredObject.promise();

            }



                }])

        .controller('SplashCtrl', ['$scope', '$modalInstance', 'msg', 'layer_title',
            function ($scope, $modalInstance, msg, layer_title) {
            $scope.msg = msg;
            $scope.layer_title = layer_title;

        }])

        .controller('downloadWindowCtrl', ['$scope', '$interval', '$modalInstance', '$http', '$window', 'url', 'layer_title', 'msg',
            function ($scope, $interval, $modalInstance, $http, $window, url, layer_title, msg) {
                $scope.url = url;
                $scope.layer_title = layer_title;
                $scope.msg = msg;

                $scope.refreshView = $interval(function(){
                            $http({
                                method : "GET",
                                url : url
                            }).then(function mySucces(response) {
                                console.log(response);
                                if(response.status=='202') {
                                    /*
                                     download.status = $translate("UPLOAD_DATA.FILE_SENT");
                                     download.statusColor = 'black';
                                     download.zipFile = '';
                                     download.ticket=-1;
                                     $cookies['downloads'] = JSON.stringify($scope.downloads);
                                     */
                                    //TODO: wait
                                } else if(response.status=='404') {
                                    //TODO: abort
                                } else if(response.status=='200') {
                                    console.log("get file");
                                    $interval.cancel($scope.refreshView);
                                    window.open(url, '_blank');
                                    $modalInstance.dismiss();
                                }else {
                                    //TODO: check if its a file
                                }
                            }, function myError(response) {
                                console.log("error");
                                //TODO: manage this
                            });

                },1000);



            }])



    .controller('PopupCtrl', ['$scope','$modalInstance', 'jsonresp', function ($scope, $modalInstance, jsonresp) {
        $scope.details = jsonresp.data;
        $scope.layerTitle=jsonresp.data.title;

        $scope.close = function () {
            $modalInstance.dismiss('close');
        };

    }]);



})();