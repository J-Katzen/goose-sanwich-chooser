'use strict';

angular.module('gooseSandwich.controllers', [])
    .controller('OrderCrtl', function ($scope, $http, $log, socket) {
        
        $scope.orders = [];

        $scope.orderItems = function() {
            $http({method: 'GET', url: '/api/orders'})
                .success(function(data, status, headers, config) {
                    $scope.orders = data;
                    console.log($scope.orders);
                })
                .error(function(data, status, headers, config) {
                    $scope.orders = data || 'Request Failed';
                    $scope.status = status;
                });
        }

        $scope.newOrder = function (new_order) {
            $log.info(new_order);
            socket.emit('order:new', new_order);
            $scope.orders.push(new_order);
        };

        $scope.updateOrder = function (order) {
            // socket.emit('contact:update', {contact: contact});
        };

        socket.on('order:new', function (order) {
            $log.info(order);
            $scope.orders.push(order);
        });

        // socket.on('order:update', function (order) {
        //     //update
        // });

        $scope.$on('$destroy', function (event) {
            socket.removeAllListeners();
            // or something like
            // socket.removeListener(this);
        });

        // at the bottom of your controller
        $scope.orderItems();
  });