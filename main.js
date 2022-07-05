window.addEventListener('DOMContentLoaded', () => {

    

    zoomedElement = (zoomedElement) => {

        // Set values here
        const minWidth = 0;
        const maxWidth = 10000;
        const startEarlier = 0; // Set this number in px to start earlier the animation (if you set this number as negative the animation will start later)
        const startFromCenter = true; // Set true to start count when the element is in the middle to the window, set false for count from the top of the element. Note: if set in true, no use the class "zoomedElementScroll"
        const rangeAnimationUp = 100; // Set this number in pixels to set the animation's growth range.
        const rangeAnimation = 150; // Set this number in pixels to set the duration of animation's growth range.
        const rangeAnimationDown = 100; // Set this number in pixels to set the decay range of the animation.
        // Set values here
        
        const bodyElement = document.querySelector('body');
        const zoomedElementParent = zoomedElement.parentNode;
        let scrollPosition = zoomedElement.offsetTop;
        let newDiv = document.createElement('DIV');
        let toSizeTop = zoomedElement;

        let initialRightPositionPercent = 0;
        let necessaryPercentRight = 0

        let percentAnimationUp = 0;
        let percentAnimationDown = 0;

        let percentScale = 1;
        let percentMarginRight = 0;
        
        let maxScaleDin = 0;

        // add css needed
        zoomedElementParent.style.position = 'relative';
        zoomedElement.style.position = 'absolute';
        zoomedElement.style.top = '0';
        zoomedElement.style.transition = 'all .1s ease';
        
        const zoomedElementFn = () => {
            if (window.innerWidth > minWidth && window.innerWidth < maxWidth) {

                if (startFromCenter) {
                    scrollPosition = scrollPosition - (window.innerHeight / 2) + (zoomedElement.clientHeight / 2);
                };

                scrollPosition -= startEarlier;

                // create substitute div if do not exist
                if (!document.querySelector('.substituteEl')) {
                    newDiv.style.width = zoomedElement.offsetWidth + "px";
                    newDiv.style.height = zoomedElement.offsetHeight + "px";
                    newDiv.setAttribute("class", "substituteEl");
                    zoomedElementParent.insertBefore(newDiv, zoomedElement);
                };

                // calculate right needed to be above the created element"
                initialRightPositionPercent = (1 / (bodyElement.clientWidth / (bodyElement.clientWidth - (zoomedElement.clientWidth + newDiv.offsetLeft)))) * 100;

                // calculate maximum scale
                maxScaleDin = bodyElement.clientWidth / zoomedElement.clientWidth;
                necessaryPercentRight = ((((1 / (bodyElement.offsetWidth / zoomedElement.offsetWidth)) * 100 ) - 100 ) * -1 ) / 2 // get percent necessary "right" for leave centered the element
                
                window.onscroll = () => {

                    // Animation Up
                    if (window.scrollY >= scrollPosition && window.scrollY < scrollPosition + rangeAnimationUp) {

                        // calculate the percent of the animation according with the rangeAnimationUp
                        percentAnimationUp = (((window.scrollY - scrollPosition) / rangeAnimationUp) * 100)

                        // calculate the values of the animation when growing up
                        percentScale = ruleOfFor(1, maxScaleDin, percentAnimationUp) // Return value between 1 and maxScaleDin
                        percentMarginRight = ruleOfFor(initialRightPositionPercent, necessaryPercentRight, percentAnimationUp) // Return value between initialRightPositionPercent and necessaryPercentRight

                        // applied values on real time
                        zoomedElement.style.transform = `scale(${percentScale})`;
                        zoomedElement.style.right = `${percentMarginRight}%`;

                    };
                    
                    // Animation Keep
                    if (window.scrollY >= scrollPosition + rangeAnimationUp && window.scrollY < scrollPosition + rangeAnimationUp + rangeAnimation) {

                        zoomedElement.style.transform = `scale(${maxScaleDin})`;
                        zoomedElement.style.right = `${necessaryPercentRight}%`;

                    };

                    // Animation Down
                    if (window.scrollY >= scrollPosition + rangeAnimationUp + rangeAnimation && window.scrollY < scrollPosition + rangeAnimationUp + rangeAnimation + rangeAnimationDown) {
                        
                        // calculate the percent of the animation according with the rangeAnimationDown (Added this expression " - 100) * -1) " to invert )
                        percentAnimationDown = ((((window.scrollY - (scrollPosition + rangeAnimationUp + rangeAnimation)) / rangeAnimationDown) * 100) - 100) * -1

                        // calculate the values of the animation when decreasing
                        percentScale = ruleOfFor(1, maxScaleDin, percentAnimationDown) // Return value between 1 and maxScaleDin
                        percentMarginRight = ruleOfFor(initialRightPositionPercent, necessaryPercentRight, percentAnimationDown) // Return value between initialRightPositionPercent and necessaryPercentRight

                        // applied values on real time
                        zoomedElement.style.transform = `scale(${percentScale})`;
                        zoomedElement.style.right = `${percentMarginRight}%`;

                    };

                    // Animation Out
                    if (window.scrollY <= scrollPosition || window.scrollY > scrollPosition + rangeAnimationUp + rangeAnimation + rangeAnimationDown) {

                        // Set default values
                        zoomedElement.style.transform = `scale(1)`;
                        zoomedElement.style.right = `${initialRightPositionPercent}%`;

                    };

                    
                };

            };
        };
        
        // minCounter _______ 0%
        // return ___________ percent
        // maxCounter _______ 100%
        const ruleOfFor = (minCounter, maxCounter, percent) => ((maxCounter - minCounter) / (100 / percent)) + minCounter

        zoomedElementFn()
        window.addEventListener('resize', zoomedElementFn);

    };

    zoomedElement(document.querySelector('.zoomedElement'));

});



