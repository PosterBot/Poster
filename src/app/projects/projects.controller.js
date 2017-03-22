(function () {
    'use strict';

    angular
        .module('angularPoster')
        .controller('ProjectsController', ['firebaseService', '$firebaseObject', function (firebaseService, $firebaseObject) {
            var vm = this,
                firebaseSettings,
                baseObject,
                data;


            vm.projects = {
                vk: {},
                telegram: {}
            };

            vm.postModel = {
                text: '',
                link: ''
            }
            vm.content = ''
            vm.activeTab = 'edit';

            function bindEvents(projectsType, key) {
                var contentRef = baseObject.$ref().child('content/' + projectsType + '/' + key);
                contentRef.on('child_added', function (data) {
                    var contentItem = data.val().split(' ');
                    
                    vm.projects[projectsType][key]['content'][data.getKey()] = {
                            link: contentItem.splice(0, 1)[0],
                            message: contentItem.join(' '),
                            key: data.getKey()
                        }
                    console.log(data.getKey(), projectsType, key) ;
                });
                contentRef.on('child_changed', function (data) {
                    var contentItem = data.val().split(' ');

                    vm.projects[projectsType][key]['content'][data.getKey()] = {
                            link: contentItem.splice(0, 1)[0],
                            message: contentItem.join(' ')
                        }
                    console.log(data.getKey(), projectsType, key) ;
                });

                contentRef.on('child_removed', function (data) {
                    delete vm.projects[projectsType][key]['content'][data.getKey()]
                    console.log(data.getKey(), projectsType, key) ; 
                });
            }

            function getProjectData(baseObject, projectsType) {
                var settings = baseObject.settings,
                    content = baseObject.content;

                _.forEach(settings.channels[projectsType], function (value, key) {
                    var item = { name: key, params: value, type: projectsType, editMode: false, content: {} }
                    vm.projects[projectsType][key] = item;
                    bindEvents(projectsType, key);
                })

            }


            function firebaseInitCallback(reference) {
                baseObject = $firebaseObject(reference);
                baseObject.$loaded()
                    .then(function () {
                        console.log(baseObject);
                        if (baseObject.settings && baseObject.settings.channels) {
                            if (baseObject.settings.channels.telegram) {
                                getProjectData(baseObject, 'telegram')
                            }
                            if (baseObject.settings.channels.vk) {
                                getProjectData(baseObject, 'vk')
                            }

                            vm.setActiveProject(vm.projects.telegram['testChannelJem']);
                        }
                    })
                    .catch(function (err) {
                        console.error(err);
                    });
            }

            function init() {
                firebaseService.init().then(firebaseInitCallback)
            }

            init();

            vm.setActiveProject = function (project) {
                if (project) {
                    vm.currentProject = project;
                }
            }

            vm.addPost = function () {
                var item = baseObject.$ref();
                item.child('content/' + vm.currentProject.type + '/' + vm.currentProject.name).push(vm.postModel.text + ' ' + vm.postModel.link)
                vm.postModel.text = '';
                vm.postModel.link = ''
            }

            vm.saveImportData = function () {
                var item = baseObject.$ref();
                var child = item.child('content/' + vm.currentProject.type + '/' + vm.currentProject.name);
                var contentData = vm.content.split('\n');
                _.forEach(contentData, function(el){
                    if(el.length > 0){
                        child.push(el);
                    }
                    
                })
                vm.content = '';
            }

            vm.showContent = function ($fileContent) {
                vm.content = $fileContent;
            };

            vm.editPost= function(post, flag){
                post.editMode = !!flag;
            }

            vm.savePost = function(post){
                var item = baseObject.$ref();
                item.child('content/' + vm.currentProject.type + '/' + vm.currentProject.name + '/' + post.key).set(post.text + ' ' + post.link );
                post.editMode = false;
                console.log(post)
            }

            vm.deletePost = function(post){
                var item = baseObject.$ref();
                item.child('content/' + vm.currentProject.type + '/' + vm.currentProject.name + '/' + post.key).remove();
                console.log(post)
            }

        }]);

})();