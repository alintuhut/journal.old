App.TimelineView = Backbone.View.extend({

    id: 'page-timeline',
    className: 'pt-page',

    initialize: function () {
        d("TimelineView initialize");
        this.viewportPosition = {x: 0, y: -1};
        App.journal.fetch({reset: true});
        /*
        App.journal.sort({silent:true})
        App.journal.models =  App.journal.models.reverse();
        App.journal.trigger('reset',  App.journal, {});
        */
        this.listView = new App.ListView();

        this.lastScrollTop = 0;
        this.timeout = false;
        this.ticking = false;

        var self = this;
        setTimeout(function(){
            $("#page-timeline").on('scroll', function(event){
                self.currentScrollTop = self.getScrollPosition();
                self.onScroll();
            });
        }, 2000);

    },

    render: function () {
        d("TimelineView render");
        this.$el.html(this.listView.render().el);
        if (!$("#scroll").length) {
            $("body").append("<span id=\"scroll\">0</span>");
        }
        return this;
    },

    onClose: function() {
        d("TimelineView onClose");
        this.listView.close();
    },

    onTransitionComplete: function(type) {
        if (type == App.TRANSITION_IN) {

        } else {
            this.$el.removeClass('pt-page-current');
            this.$el.find('article.selected').removeClass('selected');

        }
    },

    onTransitionStart: function(type) {
        if (type == App.TRANSITION_IN) {
            App.headerView.activate('menu-timeline');
            var st = this.getScrollPosition();
            if (st < 50) {
                $("#header").removeClass('off');
            }
        }
    },

    onScroll: function() {
        if(!this.ticking) {
            window.requestAnimationFrame(this.updateScroll.bind(this));
        }
        this.ticking = true;
    },

    updateScroll: function() {
        var st = this.currentScrollTop;
        if (st != this.lastScrollTop) {
            if ($("#menu").hasClass('on')) {
                App.vent.trigger("menu:hide");
            } else {
                if (st > this.lastScrollTop) {
                    // downscroll code
                    if (st > 50) {
                        $("#header").addClass("off");
                    }
                } else {
                    // upscroll code
                    $("#header").removeClass("off");
                }
            }
        }
        $("#scroll").html(st);
        this.lastScrollTop = st;
        this.ticking = false;
    },

    getScrollPosition: function() {
        return $("#page-timeline")[0].scrollTop;
    }



});