'use strict';

angular.module('nufeedsApp')
  .directive('scroll', function($window){
        var inView;
        var lastImage = -1;
        var imageNo = 0;
        var scrollDirection = 'down';
        var lastScrollTop = 0;

        function detectDirection(){
            var st = $window.pageYOffset;

            if (st > lastScrollTop){
                scrollDirection = 'down';
            } else if (st < lastScrollTop){
                scrollDirection = 'up';
            } else {
                scrollDirection = 'static';
            }

            lastScrollTop = st;

            return scrollDirection;
        }

        return function(scope, element, attrs) {
            angular.element($window).bind('scroll', function(){
                //console.log('scrolled');

                inView = $('.photo:in-viewport( 200 )');
                imageNo = +inView.attr('image');
                console.log(detectDirection());

                if (imageNo !== lastImage) {
                    $('.in-view').removeClass('in-view');
                    inView.addClass('in-view');
                    var attributes = inView.children().attr('src');
                    console.log('image:' + imageNo + '  lastImage:' + lastImage);

                    lastImage = imageNo;
                    if (detectDirection() == 'up'){
                        lastImage = imageNo+1;
                    }



                    //imageNo++;
                }

                scope.$apply();
            });
        }
    });
