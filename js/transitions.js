var Transition = (function () {

    var animEndEventNames = {
        'WebkitAnimation' : 'webkitAnimationEnd',
        'OAnimation' : 'oAnimationEnd',
        'msAnimation' : 'MSAnimationEnd',
        'animation' : 'animationend'
        },
        animEndEventName,
        animSupport,
        isAnimating = false,
        endCurrPage = false,
        endNextPage = false,
        animations = {
            'out': {
                '0,1': 'pt-page-moveToTop',
                '0,-1': 'pt-page-moveToBottom',
                '1,0': 'pt-page-moveToRight',
                '-1,0': 'pt-page-moveToLeft'
            },
            'in': {
                '0,1': 'pt-page-moveFromBottom',
                '0,-1': 'pt-page-moveFromTop',
                '1,0': 'pt-page-moveFromLeft',
                '-1,0': 'pt-page-moveFromRight'
            }
        },
        queue = [],

        onEndAnimation = function(currenView, nextView) {
            endCurrPage = false;
            endNextPage = false;
            currenView.$el.attr( 'class', currenView.$el.data( 'originalClassList' ) );
            currenView.$el.removeClass('pt-page-current');
            nextView.$el.attr( 'class', nextView.$el.data( 'originalClassList' ) + ' pt-page-current' );
            isAnimating = false;
            if (nextView.onTransitionComplete) {
                nextView.onTransitionComplete(App.TRANSITION_IN);
            }
            if (currenView.onTransitionComplete) {
                //setTimeout(function(){
                    currenView.onTransitionComplete(App.TRANSITION_OUT);
                //}, 1);
            }
            runQueue();
        },

        runQueue = function() {
            console.log('Running queue lenth = ', queue.length);
            if (queue.length == 0 || isAnimating) {
                if (queue.length == 0) {
                    console.log('Queue empty => out');
                }
                if (isAnimating) {
                    console.log('Animation in progress => out');
                }
                return;
            }
            isAnimating = true;
            var animation = queue.splice(0, 1);
            setTimeout(function(){
                animate(animation[0]);
                }, 1
            );
        },

        animate = function(animation) {

            var currenView = animation[0],
                nextView = animation[1],
                $currPage = currenView.$el,
                $nextPage = nextView.$el,
                outClass = '',
                inClass = '';

            //console.log('Current View = ', currenView.viewportPosition.x +','+ currenView.viewportPosition.y);
            //console.log('Next View = ', nextView.viewportPosition.x +','+ nextView.viewportPosition.y);
            var step = {x: 0 - nextView.viewportPosition.x, y: 0 - nextView.viewportPosition.y};
            outClass = animations.out[step.x+','+step.y];
            inClass = animations.in[step.x+','+step.y];
            nextView.viewportPosition.x = nextView.viewportPosition.y = 0;
            currenView.viewportPosition.x += step.x;
            currenView.viewportPosition.y += step.y;

            //console.log(step);
            console.log('outclass = ', outClass, currenView.el);
            console.log('inclass = ', inClass, nextView.el);
            // console.log(currenView.viewportPosition);
            // console.log(nextView.viewportPosition);

            $currPage.data( 'originalClassList', $currPage.attr( 'class' ));
            $nextPage.data( 'originalClassList', $nextPage.attr( 'class' ));
            $currPage.addClass('pt-page-ontop');
            $nextPage.addClass('pt-page-current');

            if (nextView.onTransitionStart) {
                setTimeout(function(){
                    nextView.onTransitionStart(App.TRANSITION_IN);
                }, 1);
            }
            if (currenView.onTransitionStart) {
                setTimeout(function(){
                    currenView.onTransitionStart(App.TRANSITION_OUT);
                }, 1);
            }

            $currPage.addClass(outClass).on(animEndEventName, function() {
                $currPage.off(animEndEventName);
                endCurrPage = true;
                if (endNextPage) {
                    onEndAnimation(currenView, nextView);
                }
            } );

            $nextPage.addClass(inClass).on(animEndEventName, function() {
                $nextPage.off(animEndEventName);
                endNextPage = true;
                if(endCurrPage) {
                    onEndAnimation(currenView, nextView);
                }
            } );

            if (!animSupport) {
                onEndAnimation(currenView, nextView);
            }
        };

    return {

        init: function() {
            console.log('init transitions');
            animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ];
            animSupport = Modernizr.cssanimations;
            isAnimating = false;
            endCurrPage = false;
            endNextPage = false;
        },

        add: function(currentView, nextView) {
            console.log('Adding ', currentView.el, nextView.el);
            queue.push([currentView, nextView]);
            runQueue();
        }

    };

})();