var myApp = angular.module('app', ['firebase']);

/*myApp.config(['$routeProvider', function($routeProvider){

    $routeProvider.
    when('/gameStart',{
        templateUrl: 'template/newgame.html',
        controller: 'todoController'
    });
}])*/

myApp.controller('todoController', function($scope, $firebaseArray){
    
    var fireDataUsers = new Firebase('https://radiant-fire-212.firebaseio.com/users');
    var fireDataTodos = new Firebase('https://radiant-fire-212.firebaseio.com/todos');
    var fireDataSession = new Firebase('https://radiant-fire-212.firebaseio.com/usersession');
    

    $scope.loggedIn = false;
    $scope.loginFailed = false;
    $scope.signupFailed = false;
    $scope.curUser ='';
    $scope.user={};
    $scope.userClk ={};

    
    $scope.users = $firebaseArray(fireDataUsers);
    
    $scope.todos = $firebaseArray(fireDataTodos);
    
    $scope.userSession = $firebaseArray(fireDataSession);
    
    $scope.todoSubmit = function(){
        var todo = {
            currentUser:$scope.curUser,
            todoTask:{
            done:false,
            task:$scope.newTask
        }
        }
        console.log(todo.todoTask.task);
        if(todo.todoTask.task == undefined || todo.todoTask.task == ''){return;}
        $scope.todos.$add(todo);
        $scope.newTask = '';
    };
    
    $scope.taskComplete = function(completeTask){
        $scope.todos.$save(completeTask);
    };
    
    $scope.deteteTask = function(index){
        $scope.todos.$remove(index, 1);
    };
    
    $scope.login = function(uname,pass){
        
        console.log(uname,pass);
        
        $scope.auth = {
            username:uname,
            password:pass
        };
        
        console.log($scope.auth);
        
        $scope.user={};
        $scope.session={};
        
        
        for($scope.user in $scope.users){
            if(angular.equals($scope.users[$scope.user],
                              $scope.auth)){
                
                $scope.userNameInput='';
                $scope.passWordInput='';
                $scope.loggedIn = true;
                $scope.signupFailed = false;
                $scope.curUser = uname;

                for($scope.session in $scope.userSession){
                    if($scope.userSession[$scope.session].$id === $scope.curUser){
                        var userStat = fireDataSession.child($scope.curUser);
                        userStat.update({loginStatus:true});
                        
                    }
                }
                return console.log('Username Matched');
            }
            $scope.userNameInput='';
            $scope.passWordInput='';
            $scope.loginFailed = true;
            $scope.signupFailed = false;
            console.log('Username Mismatch');
        }
        
    }
    
    $scope.signup = function(uname,pass){
        
        $scope.newUser = {
            username:uname,
            password:pass
        };
        

        console.log($scope.newUser);
        $scope.user={};
        
        if(!($scope.newUser.username == undefined ||
            $scope.newUser.password == undefined)){
            if($scope.newUser.username !== '' &&
              $scope.newUser.password !== ''){
                for($scope.user in $scope.users){
                    if($scope.newUser.username ===
                    $scope.users[$scope.user].username){
                        $scope.signupFailed = true;
                        $scope.loginFailed = false;
                        $scope.userNameInput = '';
                        $scope.passWordInput = '';
                        return;
                    }
                }
                $scope.signupFailed = false;
                $scope.loginFailed = false;
                $scope.userNameInput = '';
                $scope.passWordInput = '';
                $scope.curUserNew = uname;
                var userStat = fireDataSession.child($scope.curUserNew);
                userStat.set({loginStatus:false,
                            connectStatus:false,
                            userRequestFrom:'none'});
                return $scope.users.$add($scope.newUser);
            }
        }
        $scope.userNameInput ='';
        $scope.passWordInput ='';
        $scope.loginFailed = false;
        $scope.signupFailed = true;
    }
    
    $scope.logout = function(curUser){
        var logoutStat = fireDataSession.child(curUser);
        logoutStat.update({loginStatus:false});
        $scope.loggedIn = false;
        $scope.loginFailed = false;
        $scope.signupFailed = false;
        $scope.userNameInput='';
        $scope.passWordInput='';       
    }

    $scope.userClicked = function(sourceUser,indexOfUser){

        $scope.fromUser = sourceUser;
        $scope.toUser = $scope.userSession[indexOfUser].$id;
        if($scope.userSession[indexOfUser].connectStatus == false){
        var connStat = fireDataSession.child($scope.toUser);
        connStat.update({connectStatus:true,
                        userRequestFrom:$scope.fromUser});
        }else{
        return window.alert('User is Busy Playing With Someone Else');
        }
    }

    $scope.cancelPlay = function(curUser){
        var connStat = fireDataSession.child(curUser);
        connStat.update({connectStatus:false,
                        userRequestFrom:'none'});
    }
    

});