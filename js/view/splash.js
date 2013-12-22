App.SplashView = Backbone.View.extend({

    id: 'page-splash',
    className: 'pt-pagex',

    initialize: function() {
        d("SplashView initialize");
        this.viewportPosition = {x: 0, y: 0};
        this.$el.find('#splash-logo').addClass('animated fadeInUpBig').show();
        var self = this;
        setTimeout(function() {
            var opts = {
                lines: 13, // The number of lines to draw
                length: 4, // The length of each line
                width: 2, // The line thickness
                radius: 5, // The radius of the inner circle
                corners: 1, // Corner roundness (0..1)
                rotate: 0, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: '#fff', // #rgb or #rrggbb
                speed: 1.3, // Rounds per second
                trail: 60, // Afterglow percentage
                shadow: false, // Whether to render a shadow
                hwaccel: true, // Whether to use hardware acceleration
                className: 'spinner', // The CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                top: 'auto', // Top position relative to parent in px
                left: 'auto' // Left position relative to parent in px
            };
            var spinner = new Spinner(opts).spin();
            self.$el.find('#splash-loader').html(spinner.el).addClass('animated fadeIn');
        }, 1000);
    },

    onTransitionComplete: function(type) {
        if (type == App.TRANSITION_OUT) {
            this.close();
        }
    }

});
