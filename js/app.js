
var App = {

    /**
     * CONSTANTS
     */
    TRANSITION_IN: 1,
    TRANSITION_OUT: 0,

    views: {},
    models: {},

    loadTemplates: function(views, callback)
    {
        d("App loadTemplates");
        var deferreds = [];
        $.each(views, function(index, view) {
            if (App[view]) {
                deferreds.push($.get('tpl/' + view + '.html', function(data) {
                    App[view].prototype.template = _.template(data);
                }, 'html'));
            } else {
                alert(view + " not found");
            }
        });
        $.when.apply(null, deferreds).done(callback);
    },

    navigate: function(url, options) {
        this.router.navigate(url, options);
    },

    DROPBOX_APP_KEY : '1nc1ycwsz8nwgdj',
    DROPBOX_TABLE : 'journal',

    start: function() {
        this.loadTemplates(["HeaderView", "TimelineView", "ListItemView", "DetailView", "EditView", "LoginView"],
            function () {
                App.router = new App.Router();
                Backbone.history.start();
        });
    }
};

App.vent = _.extend({}, Backbone.Events);

App.Router = Backbone.Router.extend({

    routes: {
        "":                 "timeline",
        "login":            "login",
        "timeline":         "timeline",
        "calendar":         "calendar",
        "settings":         "settings",
        "view/:id":         "entryDetail",
        "add":              "add",
        "edit/:id":         "edit"
    },

    initialize: function () {
        d("Router initialize");

        d('initializing dropbox');
        App.dropbox = new Dropbox.Client({key: App.DROPBOX_APP_KEY});

        App.dropbox.authenticate({interactive:false}, function (error) {
            if (error) {
                alert('Authentication error: ' + error);
            }
        });

        if (!_.isUndefined(App.dropboxTable)) {
            // setting up application wide collection
            App.journal = new App.Journal();
        }

        Transition.init();

        this.currentView = App.splashView;
        App.headerView = new App.HeaderView({el: 'header'});
        App.headerView.render();
        this.$content = $("#pt-main");
    },

    isLogged: function() {
        return App.dropbox.isAuthenticated();
    },

    showView:function (view) {
        this.$content.append(view.render().el);
        Transition.add(this.currentView, view);
        this.currentView = view;
        return view;
    },

    login: function() {
        if(this.isLogged()) {
            this.navigate('timeline', {trigger: true, replace: true});
            return;
        }
        if (!App.loginView) {
            App.loginView = new App.LoginView();
            App.loginView.render();
            this.$content.append(App.loginView.el);
        } else {
            d('Reusing login view');
            App.loginView.delegateEvents();
        }
        Transition.add(this.currentView, App.loginView);
        this.currentView = App.loginView;
        App.headerView.selectMenuItem('login');
    },

    timeline: function () {
        if(!this.isLogged()) {
            this.navigate('login', {trigger: true, replace: true});
            return;
        }

        if (!App.timelineView) {
            App.timelineView = new App.TimelineView();
            App.timelineView.render();
            this.$content.append(App.timelineView.el);
        } else {
            d('Reusing timeline view');
            App.timelineView.delegateEvents();
        }
        Transition.add(this.currentView, App.timelineView);
        this.currentView = App.timelineView;
        App.headerView.selectMenuItem('timeline');
    },

    entryDetail: function (id) {
        var entry = App.journal.get(id);
        if (entry instanceof App.Entry) {
            this.showView(new App.DetailView({model: entry}));
        } else {
            entry = new App.Entry({id: id});
            var self = this;
            entry.fetch({
                success: function (data) {
                    self.showView(new App.DetailView({model: data}));
                }
            });
        }
        App.headerView.selectMenuItem('detail', {id: id});
    },

    add: function() {
        var entry = new App.Entry();
        var view = new App.EditView({model: entry});
        this.showView(view);
        App.headerView.selectMenuItem('add');
    },

    edit: function(id) {
        var entry = App.journal.get(id);
        if (entry instanceof App.Entry) {
            this.showView(new App.EditView({model: entry}));
        } else {
            entry = new App.Entry({id: id});
            var self = this;
            entry.fetch({
                success: function (data) {
                    self.showView(new App.EditView({model: data}));
                }
            });
        }
        App.headerView.selectMenuItem('edit', {id: id});
    }

});

$(document).on("ready", function () {
    App.splashView = new App.SplashView({el: '#page-splash'});
});

$(window).on("load", function() {

    d('initializing dropbox');
    App.dropbox = new Dropbox.Client({key: App.DROPBOX_APP_KEY});

    App.dropbox.authenticate({interactive:false}, function (error) {
        if (error) {
            alert('Authentication error: ' + error);
        }
    });

    if (App.dropbox.isAuthenticated()) {

        App.dropbox.getDatastoreManager().openDefaultDatastore(function (error, datastore) {
            if (error) {
                alert('Error opening default datastore: ' + error);
            }
            App.dropboxTable = datastore.getTable(App.DROPBOX_TABLE);

            datastore.recordsChanged.addListener(function (event) {
                //console.log('records changed:', event.affectedRecordsForTable(App.DROPBOX_TABLE));
                //App.vent.trigger("dropbox:sync", event.affectedRecordsForTable(App.DROPBOX_TABLE));
                var records = event.affectedRecordsForTable(App.DROPBOX_TABLE);
                _.each(records, function(remote) {
                    //check if id exists in local collection
                    var local = App.journal.get(remote.getId());
                    if (local) {
                        if (remote.isDeleted()) {
                            // if delete operation, do delete
                            App.journal.remove([local]);
                            local.destroy();
                        } else {
                            // do edit
                            local.set(remote.getFields());
                        }
                    } else {
                        // do add
                        var local = remote.getFields();
                        local.id = remote.getId();
                        var local = new App.Entry(local);
                        App.journal.add(local);
                    }
                });
            });
            App.start();
        });

    } else {
        App.start();
    }
    
});

Backbone.View.prototype.close = function ()
{
    d('Closing view ', this);
    if (this.onClose) {
        this.onClose();
    }
    this.remove();
    this.unbind();
};
Backbone.View.prototype.viewportPosition = {x: 1, y: 0}
