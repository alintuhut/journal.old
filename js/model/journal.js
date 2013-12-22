App.Entry = Backbone.Model.extend({

    defaults: {
        id: null,
        date: '',
        text: ''
    },

    validate: function( attributes ){
        if (attributes.text == ''){
            return "Text property cannot be empty";
        }
        if (attributes.date == ''){
            return "Date property cannot be empty";
        }
        d('Entry validating', attributes);
    },

    initialize: function(){
        this.dropboxStorage = new Backbone.DropboxStorage(App.dropboxTable);
    }

});

App.Journal = Backbone.Collection.extend({

    model: App.Entry,

    initialize:function () {
        this.dropboxStorage = new Backbone.DropboxStorage(App.dropboxTable);
    },

    // sorted by their original insertion order.
    comparator: function (model) {
        return -model.get('date');
    }


});
