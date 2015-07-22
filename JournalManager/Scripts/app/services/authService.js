/*

    ** ATTENTION ***

    The code found herein is not for instructional purposes,
    but rather to mock the existince of a server to the client
    application.

    The implemenation found here allows the application to 
    intercept REST calls to the server and read and write
    data to the browser's localStorage in order to give the 
    illusion of having a persistence mechanism available 
    on the server.

    The advantage of an approach like this is that the code
    on the client remains completely unaffected by the fake 
    server implementation - which may be removed at any time.

*/
(function () {

    'use strict';

    var app = angular.module('app');

    app.service('authService',

            ['_', 'localStorage',
    function (_, localStorage) {

        var svc = {

            data: [],

            key: 'journalitems.data',

            serializeData: function () {
                localStorage[svc.key] = JSON.stringify(svc.data);
            },

            deserializeData: function (data) {
                svc.data = JSON.parse(data);
            },

            init: function () {

                var data = localStorage[svc.key];

                if (data != undefined) {
                    svc.deserializeData(data);
                }

                //if (svc.data.length === 0) {
                //    svc.data = generateSeedData();
                //    svc.serializeData();
                //}
            },

            save: function (item) {

                var isNew = null;//svc.getById(item.username).id === nullHome.id;

                if (isNew) {
                    svc.insert(item);
                } else {
                    svc.update(item);
                }
            },

            insert: function (item) {

                if (!_.isObject(item)) throw new Error('A home object is required to do an insert.');

                if (item.username === null) {
                    item.username = 'admin';
                }

                svc.data.unshift(item);
                svc.serializeData();
            },

            update: function (home) {

                if (!_.isObject(home)) throw new Error('A home object is required to do an update.');

                var index = svc.data.length;
                var currentHome;

                while (index--) {

                    if (index >= 0) {

                        currentHome = svc.data[index];

                        if (currentHome &&
                            currentHome.id === home.id &&
                            (new Date(currentHome.modifiedDate)) < home.modifiedDate) {
                            svc.data[index] = home;
                        }
                    }
                }

                svc.serializeData();

            },

            getById: function (id) {

                var returnValue = nullHome;

                svc.data.forEach(function (home) {
                    if (home.id === id) {
                        returnValue = home;
                    }
                });

                return returnValue;
            },

            'delete': function (id) {
                var lengthOfUUID = 36;

                if (id.length != lengthOfUUID) throw new Error('A valid UUID value is required as an ID.');

                var
                    len = svc.data.length,
                    index;

                while (len--) {
                    index = len - 1;
                    if (svc.data[index] && svc.data[index].id === id) {
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
            getById: svc.getById
        };

    }]);

}());