App.LoginView = Backbone.View.extend({

    id: 'page-login',
    className: 'pt-page',

    initialize: function() {
        d("LoginView initialize");
        this.viewportPosition = {x: 0, y: -1};
    },

    render: function () {
        d("LoginView render");
        this.$el.html(this.template());
        return this;
    },

    events: {
        "click #login-button": "login"
    },

    login: function(e) {
        e.preventDefault();
        App.dropbox.authenticate();
    }

});
