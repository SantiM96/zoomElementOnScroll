window.addEventListener('DOMContentLoaded', () => {
    
    
    
    let dataToScroll = []
    const zoomedElement = (zoomedElement) => {

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
        // zoomedElement.style.top is setting from newDiv inserted
        zoomedElement.style.transition = 'all .1s ease';
        
        const zoomedElementFn = () => {
            if (window.innerWidth > minWidth && window.innerWidth < maxWidth) {
                
                if (startFromCenter) {
                    scrollPosition = scrollPosition - (window.innerHeight / 2) + (zoomedElement.clientHeight / 2);
                };
                
                scrollPosition -= startEarlier;
                
                // create substitute div if do not exist
                for (const el of zoomedElement.parentNode.childNodes) {
                    if (!(el.nodeName != '#text' && el.classList.contains('substituteEl'))) {
                        
                        newDiv.style.width = zoomedElement.offsetWidth + "px";
                        newDiv.style.height = zoomedElement.offsetHeight + "px";
                        newDiv.setAttribute("class", "substituteEl");
                        zoomedElementParent.insertBefore(newDiv, zoomedElement);
                        zoomedElement.style.top = `${newDiv.offsetTop}px`;

                    }
                }
                
                // calculate right needed to be above the created element
                initialRightPositionPercent = (1 / (bodyElement.clientWidth / (bodyElement.clientWidth - (zoomedElement.clientWidth + newDiv.offsetLeft)))) * 100;

                // calculate maximum scale
                maxScaleDin = bodyElement.clientWidth / zoomedElement.clientWidth;
                necessaryPercentRight = ((((1 / (bodyElement.offsetWidth / zoomedElement.offsetWidth)) * 100 ) - 100 ) * -1 ) / 2 // get percent necessary "right" for leave centered the element

                // add data to use onscroll
                dataToScroll.push({
                    zoomedElement: zoomedElement,
                    scrollPosition: scrollPosition,
                    rangeAnimationUp: rangeAnimationUp,
                    rangeAnimation: rangeAnimation,
                    rangeAnimationDown: rangeAnimationDown,
                    maxScaleDin: maxScaleDin,
                    initialRightPositionPercent: initialRightPositionPercent,
                    necessaryPercentRight: necessaryPercentRight
                });
                
                window.onscroll = () => {

                    for(const obj of dataToScroll) {

                        // Animation Up
                        if (window.scrollY >= obj.scrollPosition && window.scrollY < obj.scrollPosition + obj.rangeAnimationUp) {

                            // calculate the percent of the animation according with the rangeAnimationUp
                            percentAnimationUp = (((window.scrollY - obj.scrollPosition) / obj.rangeAnimationUp) * 100)

                            // calculate the values of the animation when growing up
                            percentScale = ruleOfFor(1, obj.maxScaleDin, percentAnimationUp) // Return value between 1 and maxScaleDin
                            percentMarginRight = ruleOfFor(obj.initialRightPositionPercent, obj.necessaryPercentRight, percentAnimationUp) // Return value between initialRightPositionPercent and necessaryPercentRight

                            // applied values on real time
                            obj.zoomedElement.style.transform = `scale(${percentScale})`;
                            obj.zoomedElement.style.right = `${percentMarginRight}%`;

                        };
                        
                        // Animation Keep
                        if (window.scrollY >= obj.scrollPosition + obj.rangeAnimationUp && window.scrollY < obj.scrollPosition + obj.rangeAnimationUp + obj.rangeAnimation) {

                            obj.zoomedElement.style.transform = `scale(${obj.maxScaleDin})`;
                            obj.zoomedElement.style.right = `${obj.necessaryPercentRight}%`;

                        };

                        // Animation Down
                        if (window.scrollY >= obj.scrollPosition + obj.rangeAnimationUp + obj.rangeAnimation && window.scrollY < obj.scrollPosition + obj.rangeAnimationUp + obj.rangeAnimation + obj.rangeAnimationDown) {
                            
                            // calculate the percent of the animation according with the rangeAnimationDown (Added this expression " - 100) * -1) " to invert )
                            percentAnimationDown = ((((window.scrollY - (obj.scrollPosition + obj.rangeAnimationUp + obj.rangeAnimation)) / obj.rangeAnimationDown) * 100) - 100) * -1

                            // calculate the values of the animation when decreasing
                            percentScale = ruleOfFor(1, obj.maxScaleDin, percentAnimationDown) // Return value between 1 and maxScaleDin
                            percentMarginRight = ruleOfFor(obj.initialRightPositionPercent, obj.necessaryPercentRight, percentAnimationDown) // Return value between initialRightPositionPercent and necessaryPercentRight

                            // applied values on real time
                            obj.zoomedElement.style.transform = `scale(${percentScale})`;
                            obj.zoomedElement.style.right = `${percentMarginRight}%`;

                        };

                        // Animation Out
                        if (window.scrollY <= obj.scrollPosition || window.scrollY > obj.scrollPosition + obj.rangeAnimationUp + obj.rangeAnimation + obj.rangeAnimationDown) {

                            // Set default values
                            obj.zoomedElement.style.transform = `scale(1)`;
                            obj.zoomedElement.style.right = `${obj.initialRightPositionPercent}%`;

                        };

                    };
                    
                };

            };
        };
        
        
        zoomedElementFn()
        window.addEventListener('resize', zoomedElementFn);
        
    };
    
    // minCounter _______ 0%
    // return ___________ percent
    // maxCounter _______ 100%
    const ruleOfFor = (minCounter, maxCounter, percent) => ((maxCounter - minCounter) / (100 / percent)) + minCounter;


    zoomedElement(document.querySelector('.zoomedElement'))
    zoomedElement(document.querySelector('.zoomedElement2'))
    // zoomedElement(document.querySelector('.zoomedElement2'))
    // for (const element of document.querySelectorAll('.zoomedElement')) {

    //     // setTimeout(() => {
    //         console.log(element);
            
    //         zoomedElement(element);
    //     // }, 1500);

    // }
    

});



