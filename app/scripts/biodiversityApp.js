(function () {
    'use strict';

    angular.module('biodiversityApp', ['ngRoute', 'ngTouch', 'mm.foundation', 'angularPromiseButtons'])
        .config(function ($routeProvider, $locationProvider, angularPromiseButtonsProvider) {

            $routeProvider
                .when('/', {
                    templateUrl: 'views/session/login.html'
                })
                .when('/login', {
                    templateUrl: 'views/session/login.html'
                })
                .when('/signup', {
                    templateUrl: 'views/session/signup.html'
                })
                .when('/species', {
                    templateUrl: 'views/species/species.html'
                })
                .when('/specie', {
                    templateUrl: 'views/species/specie.html'
                });
            angularPromiseButtonsProvider.extendConfig({
                spinnerTpl: '<span class="fa fa-spinner spinner fa-spin" aria-hidden="true"></span>',
                disableBtn: true,
                btnLoadingClass: 'is-loading',
                addClassToCurrentBtnOnly: false,
                disableCurrentBtnOnly: false,
                minDuration: false,
                CLICK_EVENT: 'click',
                CLICK_ATTR: 'ngClick',
                SUBMIT_EVENT: 'submit',
                SUBMIT_ATTR: 'ngSubmit',
                BTN_SELECTOR: 'button'
            });
        })
        .run(function ($rootScope) {
            $rootScope.API_URL = 'https://catalogo-biodiversidad.herokuapp.com';
            //$rootScope.API_URL = 'http://localhost:5000';
        })
        .controller('MainCtrl', function ($scope) {
        })
        .controller('LoginController', function ($scope, $location, SessionServices) {
            var vm = this;

            vm.login = function () {
                SessionServices.login(vm.email, vm.password)
                    .then(function (response) {
                        $location.path('/species');
                    }, function (error) {
                        vm.showError = true;
                    });
            };
        })
        .controller('UserSignUpController', function ($scope, SessionServices) {
            var vm = this;
            vm.signup = function () {
                SessionServices.signup(vm.user)
                    .then(function (response) {
                        console.log(response);
                    }, function (error) {
                        console.log(error);
                    });
            };
        })
        .controller('SpeciesController', function ($scope, SpeciesServices) {
            var vm = this;
            function initCtrl() {
                SpeciesServices.getAllCategories()
                    .then(function (response) {
                        vm.categories = response.data;
                        vm.selectedCategory = vm.categories[0];
                        vm.species = [{
                            id: 1,
                            name: 'Specie Name',
                            short_description: 'short description',
                            long_description: 'super mega long description',
                            scientific_name: 'scientific name',
                            taxonomy: 'taxonomy',
                            photo: 'url'
                        }, {
                            id: 1,
                            name: 'Specie Name',
                            short_description: 'short description',
                            long_description: 'super mega long description',
                            scientific_name: 'scientific name',
                            taxonomy: 'taxonomy',
                            photo: 'url'
                        }, {
                            id: 1,
                            name: 'Specie Name',
                            short_description: 'short description',
                            long_description: 'super mega long description',
                            scientific_name: 'scientific name',
                            taxonomy: 'taxonomy',
                            photo: 'url'
                        }, {
                            id: 1,
                            name: 'Specie Name',
                            short_description: 'short description',
                            long_description: 'super mega long description',
                            scientific_name: 'scientific name',
                            taxonomy: 'taxonomy',
                            photo: 'url'
                        }, {
                            id: 1,
                            name: 'Specie Name',
                            short_description: 'short description',
                            long_description: 'super mega long description',
                            scientific_name: 'scientific name',
                            taxonomy: 'taxonomy',
                            photo: 'url'
                        }, {
                            id: 1,
                            name: 'Specie Name',
                            short_description: 'short description',
                            long_description: 'super mega long description',
                            scientific_name: 'scientific name',
                            taxonomy: 'taxonomy',
                            photo: 'url'
                        }];
                        console.log(vm.categories);
                    }, function (error) {
                        console.log(error);
                    });
            };
            initCtrl();
        })
        .controller('SpecieController', function ($scope, $modal) {
            var vm = this;

            vm.addComment = function () {
                var params = {
                    templateUrl: 'views/species/modals/addComment.html',
                    resolve: {
                        specieId: function () {
                            return vm.specie.id;
                        },
                    },
                    controller: function ($scope, $modalInstance, specieId, CommentServices) {
                        $scope.comment = {
                            specie_id: specieId
                        };
                        $scope.ok = function () {
                            $scope.addCommentPromise = CommentServices.createComment($scope.comment)
                                .then(function (response) {
                                    alertify.success('Comentario agregado con exito.');
                                    $modalInstance.close($scope.comment);
                                }, function (error) {
                                    console.log(error);
                                });
                        };

                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };

                    }
                };

                var modalInstance = $modal.open(params);

                modalInstance.result.then(function (comment) {
                    vm.specie.comments.push(comment);
                });

            };

            vm.specie = {
                id: 2,
                name: 'Lorem ipsum dolor sit amet.',
                short_description: 'Pellentesque ullamcorper quis turpis ut porta. Cras facilisis ac lorem vulputate gravida. Fusce molestie malesuada ipsum id volutpat. Duis purus.',
                long_description: 'Sed non laoreet nibh, sed mattis eros. Curabitur eget semper tortor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus dignissim, risus mattis tempus convallis, lorem nisl convallis leo, in mattis ligula felis eu lorem. Nam sit amet tellus vitae eros malesuada pretium a eu ligula. Nam suscipit fermentum bibendum. Duis pharetra laoreet diam, vel porta ante faucibus in. In arcu arcu, posuere quis quam ut, molestie vehicula tellus. Cras leo quam, gravida sed ex eget, pharetra consequat ante. Phasellus suscipit tortor et mauris pellentesque luctus sed eget dolor. In suscipit consequat ligula, in molestie nisi fermentum suscipit. Cras viverra est pulvinar sapien ultricies luctus.',
                scientific_name: 'scientifi',
                taxonomy: 'taxonomy',
                photo: 'url',
                comments: [
                    {
                        id: 1,
                        email: 'email@email.com',
                        comment: 'Sed non laoreet nibh, sed mattis eros. Curabitur eget semper tortor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus dignissim, risus mattis tempus convallis, lorem nisl convallis leo, in mattis ligula felis eu lorem. Nam sit amet tellus vitae eros malesuada pretium a eu ligula. Nam suscipit fermentum bibendum. Duis pharetra laoreet diam, vel porta ante faucibus in. In arcu arcu, posuere quis quam ut, molestie vehicula tellus. Cras leo quam, gravida sed ex eget, pharetra consequat ante. Phasellus suscipit tortor et mauris pellentesque luctus sed eget dolor. In suscipit consequat ligula, in molestie nisi fermentum suscipit. Cras viverra est pulvinar sapien ultricies luctus.∆'
                    },
                    {
                        id: 1,
                        email: 'email@email.com',
                        comment: 'Sed non laoreet nibh, sed mattis eros. Curabitur eget semper tortor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus dignissim, risus mattis tempus convallis, lorem nisl convallis leo, in mattis ligula felis eu lorem. Nam sit amet tellus vitae eros malesuada pretium a eu ligula. Nam suscipit fermentum bibendum. Duis pharetra laoreet diam, vel porta ante faucibus in. In arcu arcu, posuere quis quam ut, molestie vehicula tellus. Cras leo quam, gravida sed ex eget, pharetra consequat ante. Phasellus suscipit tortor et mauris pellentesque luctus sed eget dolor. In suscipit consequat ligula, in molestie nisi fermentum suscipit. Cras viverra est pulvinar sapien ultricies luctus.∆'
                    }, {
                        id: 1,
                        email: 'email@email.com',
                        comment: 'Sed non laoreet nibh, sed mattis eros. Curabitur eget semper tortor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus dignissim, risus mattis tempus convallis, lorem nisl convallis leo, in mattis ligula felis eu lorem. Nam sit amet tellus vitae eros malesuada pretium a eu ligula. Nam suscipit fermentum bibendum. Duis pharetra laoreet diam, vel porta ante faucibus in. In arcu arcu, posuere quis quam ut, molestie vehicula tellus. Cras leo quam, gravida sed ex eget, pharetra consequat ante. Phasellus suscipit tortor et mauris pellentesque luctus sed eget dolor. In suscipit consequat ligula, in molestie nisi fermentum suscipit. Cras viverra est pulvinar sapien ultricies luctus.∆'
                    }, {
                        id: 1,
                        email: 'email@email.com',
                        comment: 'Sed non laoreet nibh, sed mattis eros. Curabitur eget semper tortor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus dignissim, risus mattis tempus convallis, lorem nisl convallis leo, in mattis ligula felis eu lorem. Nam sit amet tellus vitae eros malesuada pretium a eu ligula. Nam suscipit fermentum bibendum. Duis pharetra laoreet diam, vel porta ante faucibus in. In arcu arcu, posuere quis quam ut, molestie vehicula tellus. Cras leo quam, gravida sed ex eget, pharetra consequat ante. Phasellus suscipit tortor et mauris pellentesque luctus sed eget dolor. In suscipit consequat ligula, in molestie nisi fermentum suscipit. Cras viverra est pulvinar sapien ultricies luctus.∆'
                    }
                ]
            };
        })
        .factory('SessionServices', function ($rootScope, $http) {
            return {
                login: function (email, password) {
                    var body = {
                        email: email,
                        password: password
                    };
                    console.log(body);
                    return $http.post($rootScope.API_URL + '/user/login', body);
                },
                signup: function (user) {
                    return $http.post($rootScope.API_URL + '/user', user);
                }
            };
        })
        .factory('SpeciesServices', function ($rootScope, $http) {
            return {
                getAllCategories: function () {
                    return $http.get($rootScope.API_URL + '/categories');
                }
            };
        })
        .factory('CommentServices', function ($rootScope, $http) {
            return {
                createComment: function (comment) {
                    return $http.post($rootScope.API_URL + '/comment', comment);
                }
            };
        });
})();