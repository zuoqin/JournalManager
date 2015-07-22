window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || Window.msIndexedDB
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange


angular.module('app', ['ngResource', 'ngCookies']).config(
    [
        '$provide', function($provide) {
            $provide.constant('indexedDB', window.indexedDB);
            $provide.constant('_', window._);
            $provide.constant('localStorage', window.localStorage);
            $provide.constant('Offline', window.Offline);
            $provide.value('nullItem', {
                id: '',
                insertDate: new Date(-8640000000000000),
                modifiedDate: new Date(-8640000000000000)
            });
            $provide.value('dbModel', {
                name: 'journalitems',
                version: '1',
                instance: null,
                objectStoreName: 'items',
                keyName: 'ItemId',
                upgrade: function(e) {
                    var db = e.target.result;
                    if (!db.objectStoreNames.contains('items')) {
                        db.createObjectStore('items', {
                            keyPath: 'ItemId'
                        });
                    }
                }
            });
        }]);