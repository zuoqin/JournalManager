
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
                if (svc.data !== undefined && svc.data !== null) {
                    localStorage[svc.key] = JSON.stringify(svc.data);
                }
                
            },

            deserializeData: function (data) {
                svc.data = JSON.parse(data);
            },

            init: function () {

                var data = localStorage[svc.key];

                var generateSeedData = function () {

    

                    /*var
                        counter = 0,
                        users = [];

                    for (var i = 0; i < 1; i++) {

                        counter++;

                        users[users.length] = {
                            username: 'zuoqin',
                            password: 'Qwerty123'
                        };
                    }*/

                    return undefined;//users;
                };

                if (data !== undefined) {
                    if (data === "undefined") {
                        localStorage.clear();//removeItem(svc.key);
                        svc.data = localStorage[svc.key];
                    } else {
                        svc.deserializeData(data);
                    }
                    
                }
                if (svc.data !== undefined && svc.data !== null) {
                    if (svc.data.length === 0) {
                        svc.data = generateSeedData();
                        svc.serializeData();
                    }

                }
            },

            save: function (user) {

                var isNew = false;//svc.getById(user.username).username === nullHome.id;

                if (isNew) {
                    svc.insert(user);
                } else {
                    svc.update(user);
                }
            },

            insert: function (user) {

                if (!_.isObject(user)) throw new Error('A home object is required to do an insert.');
                if (svc.data === undefined || svc.data === null) {
                    svc.data = [];
                }
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
            getUser: function () {
                if (svc.data !== undefined && svc.data !== null ) {
                    if (svc.data.length > 0) {
                        return svc.data[0];
                    }
                    return undefined;
                }
                return undefined;
            },
            getById: function (username) {

                var returnValue = null;
                if (svc.data !== undefined && svc.data !== null) {
                    svc.data.forEach(function (user) {
                        if (user.username === username) {
                            returnValue = user;
                        }
                    });

                }

                return returnValue;
            },

            removeAll: function() {
                localStorage.clear();//.removeItem(svc.key);
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
            getUser: svc.getUser,
            removeAll: svc.removeAll
        };

    }]);
}());