'use strict';

angular.module('confusionApp')

.controller('MenuController', ['$scope', 'menuFactory', 'favoriteFactory',
                               function($scope, menuFactory, favoriteFactory) {    
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.showMenu = false;
    $scope.showFavorites = false;
    $scope.message = "Loading...";

    $scope.dishes = {};
    menuFactory.query(
        function (response) {
            $scope.dishes = response;
            $scope.showMenu = true;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        }
    );
    
    $scope.select = function(setTab) {
        $scope.tab = setTab;
        
        if (setTab === 2) {
            $scope.filtText = "appetizer";
        }
        else if (setTab === 3) {
            $scope.filtText = "mains";
        }
        else if (setTab === 4) {
            $scope.filtText = "dessert";
        }
        else {
            $scope.filtText = "";
        }
    };

    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };
    
    $scope.toggleDetails = function() {
        $scope.showDetails = !$scope.showDetails;
    };

    $scope.toggleFavorites = function() {
        $scope.showFavorites = !$scope.showFavorites;
    };

    $scope.addToFavorites = function(dishid) {
        favoriteFactory.save({_id: dishid});
        $scope.toggleFavorites();
    };
}])

.controller('ContactController', ['$scope', function($scope) {
    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
    
    var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
    
    $scope.channels = channels;
    $scope.invalidChannelSelection = false;    
}])

.controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope, feedbackFactory) {    
    $scope.sendFeedback = function() {
        
        console.log($scope.feedback);
        
        if ($scope.feedback.agree && ($scope.feedback.mychannel === "")) {
            $scope.invalidChannelSelection = true;
            console.log('incorrect');
        }
        else {
            feedbackFactory.save($scope.feedback);

            $scope.invalidChannelSelection = false;
            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
            $scope.feedback.mychannel="";
            $scope.feedbackForm.$setPristine();
            console.log($scope.feedback);
        }
    };
}])

.controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function ($scope, $stateParams, menuFactory) {
    $scope.dish = {};
    $scope.showDish = false;
    $scope.message="Loading ...";
    
    menuFactory.get({id: $stateParams.id }).$promise.then(
        function (response) {
            $scope.dish = response;
            $scope.showDish = true;
        },
        function(response) {
            $scope.message = "Error: "+response.status + " " + response.statusText;
        }
    );   
}])

.controller('DishCommentController', ['$scope', '$state', '$stateParams', 'commentFactory',
                                      function ($scope, $state, $stateParams, commentFactory) {
        
    $scope.mycomment = {rating:5, comment:""};
    $scope.nstars = [{value:1, label:"1"}, {value:2, label:"2"}, {value:3, label:"3"},
                     {value:4, label:"4"}, {value:5, label:"5"}];           
    $scope.submitComment = function () {
        
        console.log($scope.mycomment);

        commentFactory.save({id:$stateParams.id}, $scope.mycomment, function(){
            // reload state after adding comment
            $state.go($state.current, {}, {reload: true});
        });

        $scope.commentForm.$setPristine();
        
        $scope.mycomment = {rating:5, comment:""};
    };
}])

.controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', 'promotionFactory',
                                function ($scope, menuFactory, corporateFactory, promotionFactory){
    $scope.promotion = {};
    $scope.dish = {};
    $scope.chef = {};

    $scope.showDish = false;
    $scope.showPromotion = false;
    $scope.showChef = false;
    $scope.message="Loading ...";

    // on the homepage, display the items with featured = true
    promotionFactory.query({
        featured: "true"
    }).$promise.then(
        function(response){
            $scope.promotion = response[0];
            $scope.showPromotion = true;
        },
        function(response){
            $scope.message = "Error: " + response.status + " " + response.statusText;
        }
    );                

    menuFactory.query({
        featured: "true"
    }).$promise.then(
        function(response){
            $scope.dish = response[0];
            $scope.showDish = true;
        },
        function(response){
            $scope.message = "Error: " + response.status + " " + response.statusText;
        }
    );

    corporateFactory.query({
        featured: "true"
    }).$promise.then(
        function(response){
            $scope.chef = response[0];
            $scope.showChef = true;
        },
        function(response){
            $scope.message = "Error: " + response.status + " " + response.statusText;
        }
    );
}])

.controller('AboutController', ['$scope', 'corporateFactory', function ($scope, corporateFactory){
    $scope.leadership = {};

    $scope.showLeadership = false;
    $scope.message="Loading ...";

    corporateFactory.query(
        function(response){
            $scope.leadership = response;
            $scope.showLeadership = true;
        },
        function(response){
            $scope.message = "Error: " + response.status + " " + response.statusText;
        }
    );
}])

.controller('FavoriteController', ['$scope', '$state', 'favoriteFactory',
                                   function ($scope, $state, favoriteFactory){
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.showDelete = false;
    $scope.showMenu = false;
    $scope.message = "Loading ...";

    $scope.dishes = {};

    favoriteFactory.query(
        function (response) {
            $scope.dishes = response.dishes;
            $scope.showMenu = true;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });

    $scope.select = function (setTab) {
        $scope.tab = setTab;

        if (setTab === 2) {
            $scope.filtText = "appetizer";
        } else if (setTab === 3) {
            $scope.filtText = "mains";
        } else if (setTab === 4) {
            $scope.filtText = "dessert";
        } else {
            $scope.filtText = "";
        }
    };

    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };

    $scope.toggleDetails = function () {
        $scope.showDetails = !$scope.showDetails;
    };

    $scope.toggleDelete = function () {
        $scope.showDelete = !$scope.showDelete;
    };
    
    $scope.deleteFavorite = function(dishid) {
        console.log('Delete favorites', dishid);
        favoriteFactory.delete({id: dishid});
        $scope.toggleDelete();
        $state.go($state.current, {}, {reload: true});
    };
 }])

.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory',
                                 function ($scope, $state, $rootScope, ngDialog, AuthFactory){
    $scope.loggedIn = false;
    $scope.username = '';
    
    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }
        
    $scope.openLogin = function () {
        ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
    };
    
    $scope.logOut = function() {
        AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
    };
    
    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
        
    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
    
    $scope.stateis = function(curstate) {
        return $state.is(curstate);  
    };    
}])

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory',
                                function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    
    $scope.doLogin = function() {
        if($scope.rememberMe) {
           $localStorage.storeObject('userinfo',$scope.loginData);
        }

        AuthFactory.login($scope.loginData);

        ngDialog.close();
    };
            
    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };
}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory',
                                   function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.register={};
    $scope.loginData={};
    
    $scope.doRegister = function() {
        console.log('Doing registration', $scope.registration);

        AuthFactory.register($scope.registration);
        
        ngDialog.close();
    };
}])

;
