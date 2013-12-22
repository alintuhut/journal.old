App.DetailView = Backbone.View.extend({

    id: 'page-detail',
    className: 'pt-page',

    initialize: function() {
        d("DetailView initialize");
        this.viewportPosition = {x: 1, y: 0};
        this.model.on("change", this.render, this);

        var self = this;
        App.vent.on("nav:delete", function(){
            d('Event nav:delete was triggered');
            self.onNavDelete();
        }, this);
        App.vent.on("nav:edit", function(){
            d('Event nav:edit was triggered');
            self.onNavEdit();
        }, this);
    },

    render: function () {
        d("DetailView render");
        this.$el.html(this.template(this.model.attributes));
        return this;
    },

    onNavDelete: function() {
        if (confirm('Are you sure, man?')) {
            this.model.destroy({
                success: function () {
                    window.history.back();
                }
            });
        }
    },

    onNavEdit: function() {
        App.navigate('edit/' + this.model.id, {trigger: true});
    },

    onClose: function() {
        App.vent.off("nav:delete", null, this);
        App.vent.off("nav:edit", null, this);
        this.model.off("change", null, this);
    },

    onTransitionComplete: function(type) {
        if (type == App.TRANSITION_OUT) {
            this.close();
        }
    },

    onTransitionStart: function(type) {
        if (type == App.TRANSITION_IN) {
            $('#header').removeClass('off');
            App.headerView.activate('menu-detail');
        }
    }

});
