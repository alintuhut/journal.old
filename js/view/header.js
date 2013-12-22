App.HeaderView = Backbone.View.extend({

    initialize: function () {
        d("HeaderView initialize");

        //disable scrolling on header & menu
        $("#header, #menu").on('touchmove', function(e){e.preventDefault();});

        var self = this;
        App.vent.on("menu:hide", function(){
            d('Event menu:hide was triggered');
            self.hideMenu();
        }, this);

    },

    render: function () {
        d("HeaderView render");
        this.$el.html(this.template());
        return this;
    },

    events: {
        "click #nav-menu, #menu-timeline h1.page-title": "onNavMenu",
        "click #nav-add": "onNavAdd",
        "click #nav-back-add": "onNavBack",
        "click #nav-back": "onNavBack",
        "click #nav-edit": "onNavEdit",
        "click #nav-delete": "onNavDelete",
        "click #nav-save": "onNavSave"
    },

    onNavBack: function() {
        window.history.back();
        return false;
    },

    onNavEdit: function() {
        App.vent.trigger("nav:edit");
        return false;
    },

    onNavDelete: function() {
        App.vent.trigger("nav:delete");
        return false;
    },

    onNavSave: function() {
        App.vent.trigger("nav:save");
        return false;
    },

    onNavMenu: function() {
        $("#menu").removeClass('select').toggleClass('on');
        return false;
    },

    onNavAdd: function() {
        App.navigate('add', {trigger: true});
        return false;
    },

    selectMenuItem: function(menuItem, extra) {
        /*d("Setting menu item: " + menuItem);
        this.$('header,footer').show();
        switch(menuItem) {
            case 'detail':
                var label = 'Edit';
                this.$add_button.attr({
                    title: label,
                    href: '#edit/' + extra.id
                });
                this.$delete_button.show();
                break;
            case 'login':
                this.$('header,footer').hide();
                break;
            default:
                var label = 'Add';
                this.$add_button.attr({
                    title: label,
                    href: '#add'
                });
                this.$delete_button.hide();
                break;
        }
        */

        /*
         $('.navbar .nav li').removeClass('active');
         if (menuItem) {
         $('.' + menuItem).addClass('active');
         }
         */
    },

    hideMenu: function() {
        $("#menu").removeClass('on');
    },

    selectMenu: function(e) {
        $("#menu").addClass('select');
        hideMenu();
        //stop = false;
        $("#header h1.page-title").text($(this).text());
        $("#nav-menu").find('i').removeClass().addClass($(this).find('i')[0].className);
        e.stopPropagation();
        return false;
    },

    activate: function(nav) {
        $("#header nav:visible").removeClass().addClass('animated fadeOutUp fast');
        $('#'+nav).removeClass().addClass('animated fadeInUp fast ontop').show();
    }


});