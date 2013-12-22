/**
 * Backbone Dropbox Datastore API Adapter
 * Version 0.0.1
 */
 
(function (root, factory) {
    if (typeof exports === 'object' && root.require) {
        module.exports = factory(require("underscore"), require("backbone"));
    } else if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define(["underscore","backbone"], function(_, Backbone) {
            // Use global variables if the locals are undefined.
            return factory(_ || root._, Backbone || root.Backbone);
        });
    } else {
        // RequireJS isn't being used. Assume underscore and backbone are loaded in <script> tags
        factory(_, Backbone);
    }
}(this, function(_, Backbone) {
    // A simple module to replace `Backbone.sync` with *Dropbox DataStore API Storage*-based
    // persistence.

    // pass the dropbox table
    Backbone.DropboxStorage = function(table) {
        this.table = table;
    };

    _.extend(Backbone.DropboxStorage.prototype, {

        create: function(model) {
            var data = model.attributes;
            delete data.id;
            var result = this.table.insert(data);
            model.set(model.idAttribute, result.getId());
            return model;
        },

        update: function(model) {
            this.table.get(model.id).update(model.attributes);
            return model;
        },

        find: function(model) {
            var record = this.table.get(model.id);
            var result = record.getFields();
            result.id = record.getId();
            return result;
        },

        findAll: function() {
            var records = this.table.query();
            var result = [];
            for (var i=0; i<records.length; i++) {
                //records[i].deleteRecord();
                var record = records[i].getFields();
                record.id = records[i].getId();
                result.push(record);
            }
            return result;
        },

        destroy: function(model) {
            if (model.isNew())
                return false;
            var record = this.table.get(model.id);
            if (record) record.deleteRecord();
            return model;
        }

    });

    // dropboxSync delegate to the model or collection's
    // *dropboxStorage* property, which should be an instance of `Store`.
    Backbone.DropboxStorage.sync = function(method, model, options) {
        var store = model.dropboxStorage || model.collection.dropboxStorage;

        var resp, errorMessage, syncDfd = Backbone.$.Deferred && Backbone.$.Deferred(); //If $ is having Deferred - use it.

        try {
            switch (method) {
                case "read":
                    resp = model.id != undefined ? store.find(model) : store.findAll();
                    break;
                case "create":
                    resp = store.create(model);
                    break;
                case "update":
                    resp = store.update(model);
                    break;
                case "delete":
                    resp = store.destroy(model);
                    break;
            }
        } catch(error) {
            errorMessage = error.message;
        }

        if (resp) {
            if (options && options.success) {
                if (Backbone.VERSION === "0.9.10") {
                    options.success(model, resp, options);
                } else {
                    options.success(resp);
                }
            }
            if (syncDfd) {
                syncDfd.resolve(resp);
            }

        } else {
            errorMessage = errorMessage ? errorMessage
                : "Record Not Found";

            if (options && options.error)
                if (Backbone.VERSION === "0.9.10") {
                    options.error(model, errorMessage, options);
                } else {
                    options.error(errorMessage);
                }

            if (syncDfd)
                syncDfd.reject(errorMessage);
        }

        // add compatibility with $.ajax
        // always execute callback for success and error
        if (options && options.complete) options.complete(resp);

        return syncDfd && syncDfd.promise();
    };

    Backbone.ajaxSync = Backbone.sync;

    Backbone.getSyncMethod = function(model) {
        if(model.dropboxStorage || (model.collection && model.collection.dropboxStorage)) {
            return Backbone.DropboxStorage.sync;
        }

        return Backbone.ajaxSync;
    };

    // Override 'Backbone.sync' to default to dropboxSync,
    // the original 'Backbone.sync' is still available in 'Backbone.ajaxSync'
    Backbone.sync = function(method, model, options) {
        return Backbone.getSyncMethod(model).apply(this, [method, model, options]);
    };

    return Backbone.DropboxStorage;
}));