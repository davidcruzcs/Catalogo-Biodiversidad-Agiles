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
        .controller('UserSignUpController', function ($scope, $location, SessionServices) {
            var vm = this;
            vm.signup = function () {
                var user = angular.copy(vm.user);
                user.country = user.country.name;
                SessionServices.signup(user)
                    .then(function (response) {
                        SessionServices.login(vm.user.email, vm.user.password)
                            .then(function (response) {
                                $location.path('/species');
                            });
                    }, function (error) {
                        console.log(error);
                    });
            };

            function initCtrl() {
                SessionServices.getCountires()
                    .then(function (response) {
                        vm.countries = response.data;
                        console.log(vm.countries);
                    });
            }

            initCtrl();
        })
        .controller('SpeciesController', function ($scope, $rootScope, $location, SpeciesServices) {
            var vm = this;

            vm.selectSpecie = function (specie) {
                $rootScope.selectedSpecie = specie;
                $location.path('/specie');
            };

            $scope.$watch('vm.selectedCategory', function (newSelected, oldSelected) {
                if (angular.isDefined(newSelected) && newSelected.id !== oldSelected.id) {
                    SpeciesServices.getSpecies(newSelected.id)
                        .then(function (response) {
                            vm.species = response.data;
                        });
                }
            });

            function initCtrl() {
                SpeciesServices.getAllCategories()
                    .then(function (response) {
                        vm.categories = response.data;
                        vm.selectedCategory = vm.categories[0];
                        SpeciesServices.getSpecies(vm.selectedCategory.id)
                            .then(function (response) {
                                vm.species = response.data;
                            });
                    }, function (error) {
                        console.log(error);
                    });
            };
            initCtrl();
        })
        .controller('SpecieController', function ($scope, $rootScope, $location, $modal, CommentServices) {
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

            if (angular.isUndefined($rootScope.selectedSpecie)) {
                $location.path('species');
            }
            vm.specie = $rootScope.selectedSpecie;

            CommentServices.getComments(vm.specie.id)
                .then(function (response) {
                    vm.specie.comments = response.data;
                });
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
                },
                getCountires: function () {
                    return $http.get('https://restcountries.eu/rest/v1/all');
                }
            };
        })
        .factory('SpeciesServices', function ($rootScope, $http) {
            return {
                getAllCategories: function () {
                    return $http.get($rootScope.API_URL + '/categories');
                },
                getSpecies: function (categoryId) {
                    return $http.post($rootScope.API_URL + '/species/category/', {
                        category_id: categoryId
                    });
                }
            };
        })
        .factory('CommentServices', function ($rootScope, $http) {
            return {
                createComment: function (comment) {
                    return $http.post($rootScope.API_URL + '/comment', comment);
                },
                getComments: function (specieId) {
                    return $http.post($rootScope.API_URL + '/species/comments/', {
                        specie_id: specieId
                    });
                }
            };
        });
})();