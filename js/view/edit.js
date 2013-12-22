App.EditView = Backbone.View.extend({

    id: 'page-edit',
    className: 'pt-page',

    initialize: function() {
        d("EditView initialize");
        this.viewportPosition = {x: 0, y: -1};
        var self = this;
        App.vent.on("nav:save", function(){
            d('Event nav:save was triggered');
            self.onSave();
        }, this);
    },

    render: function () {
        d("EditView render");
        this.$el.html(this.template(this.model.attributes));
        this.$input = this.$('#item-text');
        return this;
    },

    onSave: function() {
        var model = new App.Entry(this.getNewAttributes());
        console.log(model);
        model.save();

        if (!_.isUndefined(App.journal)) {
            if (model.id) {
                App.journal.set([model]);
            } else {
                App.journal.add(model);
            }
        }
        this.$input.val('');
        //App.navigate('timeline', {trigger: true, replace: true});
        window.history.back();
    },

    getNewAttributes: function() {
        return {
            id: this.model.id ? this.model.id : null,
            text: this.$input.val().trim(),
            date: new Date().toISOString()
        };
    },

    onTransitionComplete: function(type) {
        if (type == App.TRANSITION_OUT) {
            this.close();
        }
    },

    onTransitionStart: function(type) {
        if (type == App.TRANSITION_IN) {
            $('#header').removeClass('off');
            App.headerView.activate('menu-add');
        }
    }

});
