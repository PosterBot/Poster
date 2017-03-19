(function() {
  'use strict';

  angular
    .module('angularPoster')
    .controller('ProjectsController', ['firebaseService','$firebaseObject', function(firebaseService, $firebaseObject){
        var vm = this,
            firebaseSettings,
            baseObject,
            data;
        vm.projects = {
                vk:[],
                telegram: []
            };
        vm.postModel = {
                text: '',
                link:''
            }
        vm.content = ''

        
        

        function init(){
            firebaseService.init().then(function(reference){
               baseObject = $firebaseObject(reference);
               baseObject.$loaded()
                .then(function() {
                    console.log(baseObject);
                    if(baseObject.settings && baseObject.settings.channels){
                        if(baseObject.settings.channels.telegram){
                            $.map(baseObject.settings.channels.telegram, function(value, key){
                                var item = {name: key, params: value}
                                if(baseObject.content && baseObject.content.telegram && baseObject.content.telegram[key]){
                                    var content = []
                                    $.map(baseObject.content.telegram[key], function(baseObject){
                                        content.push(baseObject);
                                    });
                                    item.content = content
                                }
                                vm.projects.telegram.push(item)
                         })
                        }
                        if(baseObject.settings.channels.vk){
                            $.map(baseObject.settings.channels.vk, function(value, key){
                                var item = {name: key, params: value}
                                if(baseObject.content && baseObject.content.vk && baseObject.content.vk[key]){
                                    var content = []
                                    $.map(baseObject.content.vk[key], function(baseObject){
                                        content.push(baseObject);
                                    });
                                    item.content = content
                                }
                                vm.projects.vk.push(item)
                         })
                        }
                    
                        vm.setActiveProject(vm.projects.telegram[0]);

                         
                    }
                })
                .catch(function(err) {
                    console.error(err);
                });
            })
        }

        init();

        vm.setActiveProject = function(project){
            if(project){
                vm.currentProject = project;
            }   
        }

        vm.addPost = function(){
            if(!vm.currentProject.content){
                vm.currentProject.content = [];
            }
            baseObject.content.telegram.testChannelJem[123] = vm.postModel.text + ' ' + vm.postModel.link;
            baseObject.$save().then(function(data){
                vm.currentProject.content.push(vm.postModel.text + ' ' + vm.postModel.link);
                vm.postModel.text ='';
                vm.postModel.link = ''
            })
        }

        vm.showContent = function($fileContent){
            vm.content = $fileContent;
        };

    }]);

})();