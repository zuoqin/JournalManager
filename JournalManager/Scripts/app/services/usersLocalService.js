
(function () {

    'use strict';

    var app = angular.module('app');

    app.service('UsersLocalServerService',

            ['_', 'localStorage',
    function (_, localStorage) {

        var svc = {

            data: [],

            key: 'journalusers.data',

            serializeData: function () {
                localStorage[svc.key] = JSON.stringify(svc.data);
            },

            deserializeData: function (data) {
                svc.data = JSON.parse(data);
            },

            init: function () {

                var data = localStorage[svc.key];

                var generateSeedData = function () {

    

                    var
                        counter = 0,
                        users = [];

                    for (var i = 0; i < 1; i++) {

                        counter++;

                        users[users.length] = {
                            username: 'zuoqin',
                            password: 'Qwerty123'
                        };
                    }

                    return users;
                };

                if (data != undefined) {
                    svc.deserializeData(data);
                }

                if (svc.data.length === 0) {
                    svc.data = generateSeedData();
                    svc.serializeData();
                }
            },

            save: function (user) {

                var isNew = false;//svc.getById(user.username).username === nullHome.id;

                if (isNew) {
                    svc.insert(home);
                } else {
                    svc.update(user);
                }
            },

            insert: function (user) {

                if (!_.isObject(user)) throw new Error('A home object is required to do an insert.');

                svc.data.unshift(user);
                svc.serializeData();
            },

            update: function (user) {

                if (!_.isObject(user)) throw new Error('A home object is required to do an update.');

                var index = svc.data.length;
                var currentUser;

                while (index--) {

                    if (index >= 0) {

                        currentUser = svc.data[index];

                        if (currentUser &&
                            currentUser.username === user.username ) {
                            svc.data[index] = user;
                        }
                    }
                }

                svc.serializeData();

            },
            getUser : function() {
                return svc.data[0];
            },
            getById: function (username) {

                var returnValue = null;

                svc.data.forEach(function (user) {
                    if (user.username === username) {
                        returnValue = user;
                    }
                });

                return returnValue;
            },

            'delete': function (username) {


                var
                    len = svc.data.length,
                    index;

                while (len--) {
                    index = len - 1;
                    if (svc.data[index] && svc.data[index].username === username) {
                        svc.data.splice(index, 1);
                    }
                }

                svc.serializeData();
            }
        };

        svc.init();

        return {
            data: svc.data,
            insert: svc.insert,
            'delete': svc.delete,
            update: svc.update,
            save: svc.save,
            getById: svc.getById,
            getUser: svc.getUser
        };

    }]);
}());