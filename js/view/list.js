App.ListView = Backbone.View.extend({

    id: 'list',

    initialize:function () {
        d("ListView initialize");
        var self = this;
        this.model = App.journal;
        this.model.on("reset", this.render, this);
        this.model.on("add", function (entry) {
            self.$el.prepend(new App.ListItemView({model:entry}).render().el);
        });
    },

    render:function () {
        d("ListView render");
        this.$el.empty();
        _.each(this.model.models, function (entry) {
            this.$el.append(new App.ListItemView({model:entry}).render().el);
        }, this);
        return this;
    },

    onClose: function(){
        d("ListView onClose");
        this.model.off("add");
        this.model.off("reset");
    }

});

App.ListItemView = Backbone.View.extend({

    tagName:"article",

    events: {
        "click" : "onTapItem"
    },

    initialize:function () {
        d("ListItemView initialize");
        this.model.on("change", this.render, this);
        this.model.on("destroy", this.destroy, this);
    },

    render:function () {
        d("ListItemView render");
        this.$el.html(this.template(this.model.attributes));
        return this;
    },

    destroy:function() {
        this.remove();
    },

    onTapItem: function(e) {
        this.$el.addClass('selected');
        App.navigate('view/' + this.model.id, {trigger: true});
    }

});