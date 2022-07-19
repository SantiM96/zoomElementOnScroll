window.addEventListener('DOMContentLoaded', () => {
    
    // **Required**
    // add the class "zoomedElement" to make a zoom

    // **Optional**
    // use the data-custom showed below in each element to change the values to set (the values shown are the default values)
    // data-zoom='{"minWidth": 0, "maxWidth": 10000, "startEarlier": 150, "startFromCenter": true, "rangeAnimationUp": 100, "rangeAnimation": 150, "rangeAnimationDown": 100, "respectSpace": true, "invert": true}'
    
    // **Note**
    // the elements to be zoomed must not have the same parent
    
    // Ej: <div class="zoomedElement" data-zoom='{"minWidth": 0, "maxWidth": 10000, "startEarlier": 150}'>


    let dataToScroll = []
    const zoomedElement = (zoomedElement) => {

        const customValues = zoomedElement.dataset.zoom != undefined ?  JSON.parse(zoomedElement.dataset.zoom) : undefined;

        // Takes data-zoom or set default values
        const minWidth = customValues != undefined && customValues.minWidth != undefined ? customValues.minWidth : 0;
        const maxWidth = customValues != undefined && customValues.maxWidth != undefined ? customValues.maxWidth : 10000;
        const startEarlier = customValues != undefined && customValues.startEarlier != undefined ? customValues.startEarlier : 150; // Set this number in px to start earlier the animation (if you set this number as negative the animation will start later)
        const startFromCenter = customValues != undefined && customValues.startFromCenter != undefined ? customValues.startFromCenter : true; // Set true to start count when the element is in the middle to the window, set false for count from the top of the element. Note: if set in true, no use the class "zoomedElementScroll"
        const rangeAnimationUp = customValues != undefined && customValues.rangeAnimationUp != undefined ? customValues.rangeAnimationUp : 100; // Set this number in pixels to set the animation's growth range.
        const rangeAnimation = customValues != undefined && customValues.rangeAnimation != undefined ? customValues.rangeAnimation : 150; // Set this number in pixels to set the duration of animation's growth range.
        const rangeAnimationDown = customValues != undefined && customValues.rangeAnimationDown != undefined ? customValues.rangeAnimationDown : 100; // Set this number in pixels to set the decay range of the animation.
        const respectSpace = customValues != undefined && customValues.respectSpace != undefined ? customValues.respectSpace : true; // Set this value in true for respect the space of the element, and set in false for grown up absolutely.
        const invert = customValues != undefined && customValues.invert != undefined ? customValues.invert : true; // Set in false to use the normal order of the elements, and set in true to invert
        // Takes data-zoom or set default values
        
        const bodyElement = document.querySelector('body');
        const zoomedElementParent = zoomedElement.parentNode;
        let secondElement = undefined;
        let scrollPosition = zoomedElement.offsetTop;
        let newDiv = document.createElement('DIV');
        let newDivSec = document.createElement('DIV');
        let scaleEl = 1;
        let scaleSecEl = 1;
        let initialOffsetTop = 0;

        let initialRightPositionPercent = 0;
        let necessaryPercentRight = 0;

        let percentAnimationUp = 0;
        let percentAnimationDown = 0;

        let percentScale = 1;
        let percentMarginRight = 0;
        let percentScaleSec = 1;
        let percentMarginRightSec = 0;
        
        let maxScaleDin = 0;

        // add css needed
        zoomedElementParent.style.position = 'relative';
        zoomedElement.style.position = 'absolute';
        // zoomedElement.style.top is setting from newDiv inserted
        zoomedElement.style.transition = 'all .2s ease';

        const zoomedElementFn = () => {
            if (window.innerWidth > minWidth && window.innerWidth < maxWidth) {

                initialOffsetTop = zoomedElement.offsetTop;
                
                if (startFromCenter) {
                    scrollPosition = scrollPosition - (window.innerHeight / 2) + (zoomedElement.clientHeight / 2);
                };

                scrollPosition -= startEarlier;

                // check second element
                for (const el of zoomedElement.parentNode.childNodes) {
                    if (el.nodeName != '#text' && el.classList.contains('secZoomedElement')) {
                        
                        secondElement = el
                        newDivSec.style.width = secondElement.style.width != 'auto' ? secondElement.style.width : secondElement.offsetWidth + "px";
                        newDivSec.style.height = secondElement.offsetHeight + "px";
                        newDivSec.setAttribute("class", "substituteSecEl");
                        zoomedElementParent.insertBefore(newDivSec, secondElement);
                        secondElement.style.top = `${newDivSec.offsetTop}px`;
                        secondElement.style.position = 'absolute';

                        // calculate right needed to be above the created element
                        initialRightPositionPercentSec = (1 / (bodyElement.clientWidth / (bodyElement.clientWidth - (secondElement.clientWidth + newDiv.offsetLeft)))) * 100;

                        // calculate maximum scale
                        maxScaleDinSec = bodyElement.clientWidth / secondElement.clientWidth;
                        necessaryPercentRightSec = ((((1 / (bodyElement.offsetWidth / secondElement.offsetWidth)) * 100 ) - 100 ) * -1 ) / 2; // get percent necessary "right" for leave centered the element

                    };
                };
                
                // create substitute div if do not exist
                for (const el of zoomedElement.parentNode.childNodes) {
                    if (!(el.nodeName != '#text' && el.classList.contains('substituteEl'))) {
                        
                        newDiv.style.width = zoomedElement.style.width != 'auto' ? zoomedElement.style.width : zoomedElement.offsetWidth + "px";
                        newDiv.style.height = zoomedElement.offsetHeight + "px";
                        newDiv.setAttribute("class", "substituteEl");
                        zoomedElementParent.insertBefore(newDiv, zoomedElement);
                        zoomedElement.style.top = `${newDiv.offsetTop}px`;

                    };
                };
                
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
                    newDiv: newDiv,
                    initialOffsetTop: initialOffsetTop,
                    initialRightPositionPercent: initialRightPositionPercent,
                    necessaryPercentRight: necessaryPercentRight,
                    respectSpace: respectSpace
                });
                if (secondElement != undefined) {
                    
                    dataToScroll[0].secondElement = {
                        el: secondElement,
                        invert: invert,
                        newDivSec: newDivSec,
                        initialRightPositionPercentSec: initialRightPositionPercentSec,
                        maxScaleDinSec: maxScaleDinSec,
                        necessaryPercentRightSec: necessaryPercentRightSec
                    };

                };
                
                window.onscroll = () => {

                    for(const obj of dataToScroll) {

                        // Animation Up
                        if (window.scrollY >= obj.scrollPosition && window.scrollY < obj.scrollPosition + obj.rangeAnimationUp) {

                            // calculate the percent of the animation according with the rangeAnimationUp
                            percentAnimationUp = (((window.scrollY - obj.scrollPosition) / obj.rangeAnimationUp) * 100);

                            // calculate the values of the animation when growing up
                            percentScale = ruleOfFor(1, obj.maxScaleDin, percentAnimationUp); // Return value between 1 and maxScaleDin
                            percentMarginRight = ruleOfFor(obj.initialRightPositionPercent, obj.necessaryPercentRight, percentAnimationUp); // Return value between initialRightPositionPercent and necessaryPercentRight

                            // applied values on real time
                            obj.zoomedElement.style.transform = `scale(${percentScale})`;
                            obj.zoomedElement.style.right = `${percentMarginRight}%`;

                            if (obj.respectSpace) {
                                
                                scaleEl = Number(obj.zoomedElement.style.transform.split('scale(')[1].split(')')[0]);
                                
                                obj.newDiv.style.width = `${obj.zoomedElement.clientWidth * scaleEl}px`;
                                obj.newDiv.style.height = `${obj.zoomedElement.clientHeight * scaleEl}px`;
                                
                                obj.zoomedElement.style.top = `${ruleOfFor(initialOffsetTop, obj.newDiv.offsetTop + ((obj.newDiv.clientHeight - obj.zoomedElement.clientHeight) / 2), percentAnimationUp)}px`;
                                
                                if (obj.secondElement != undefined) {
                                    
                                    scaleSecEl = Number(obj.secondElement.el.style.transform.split('scale(')[1].split(')')[0]);

                                    // calculate the values of the animation when growing up
                                    percentScaleSec = ruleOfFor(1, obj.secondElement.maxScaleDinSec, percentAnimationUp); // Return value between 1 and maxScaleDin
                                    percentMarginRightSec = ruleOfFor(obj.secondElement.initialRightPositionPercentSec, obj.secondElement.necessaryPercentRightSec, percentAnimationUp); // Return value between initialRightPositionPercent and necessaryPercentRight
    
                                    // applied values on real time
                                    obj.secondElement.el.style.transform = `scale(${percentScaleSec})`;
                                    obj.secondElement.el.style.right = `${percentMarginRightSec}%`;

                                    // modify the substituteSecEl
                                    obj.secondElement.newDivSec.style.width = `${obj.secondElement.el.clientWidth * scaleSecEl}px`;
                                    obj.secondElement.newDivSec.style.height = `${obj.secondElement.el.clientHeight * scaleSecEl}px`;
                                    
                                    obj.secondElement.el.style.top = `${obj.secondElement.newDivSec.offsetTop + ((obj.secondElement.newDivSec.clientHeight - obj.secondElement.el.clientHeight) / 2)}px`;

                                    if (obj.secondElement.invert) {

                                        obj.zoomedElement.style.top = `${ruleOfFor(obj.secondElement.el.offsetTop, obj.zoomedElement.clientHeight / 2, percentAnimationUp)}px`;
                                        obj.secondElement.el.style.top = `${ruleOfFor(obj.secondElement.newDivSec.offsetTop, ((obj.zoomedElement.clientHeight * 2) + (obj.secondElement.el.clientHeight / 2)), percentAnimationUp)}px`;

                                    };

                                };
                            };

                        };
                        
                        // Animation Keep
                        if (window.scrollY >= obj.scrollPosition + obj.rangeAnimationUp && window.scrollY < obj.scrollPosition + obj.rangeAnimationUp + obj.rangeAnimation) {

                            obj.zoomedElement.style.transform = `scale(${obj.maxScaleDin})`;
                            obj.zoomedElement.style.right = `${obj.necessaryPercentRight}%`;

                            if (obj.respectSpace) {

                                obj.newDiv.style.width = `${obj.zoomedElement.clientWidth * scaleEl}px`;
                                obj.newDiv.style.height = `${obj.zoomedElement.clientHeight * scaleEl}px`;

                                if (obj.secondElement != undefined) {
        
                                    obj.secondElement.el.style.transform = `scale(${obj.maxScaleDinSec})`;
                                    obj.secondElement.el.style.right = `${obj.necessaryPercentRightSec}%`;
    
                                    // modify the substituteSecEl
                                    obj.secondElement.newDivSec.style.width = `${obj.secondElement.el.clientWidth * scaleSecEl}px`;
                                    obj.secondElement.newDivSec.style.height = `${obj.secondElement.el.clientHeight * scaleSecEl}px`;
    
                                };
                            };

                        };

                        // Animation Down
                        if (window.scrollY >= obj.scrollPosition + obj.rangeAnimationUp + obj.rangeAnimation && window.scrollY < obj.scrollPosition + obj.rangeAnimationUp + obj.rangeAnimation + obj.rangeAnimationDown) {
                            
                            // calculate the percent of the animation according with the rangeAnimationDown (Added this expression " - 100) * -1) " to invert )
                            percentAnimationDown = ((((window.scrollY - (obj.scrollPosition + obj.rangeAnimationUp + obj.rangeAnimation)) / obj.rangeAnimationDown) * 100) - 100) * -1;

                            // calculate the values of the animation when decreasing
                            percentScale = ruleOfFor(1, obj.maxScaleDin, percentAnimationDown); // Return value between 1 and maxScaleDin
                            percentMarginRight = ruleOfFor(obj.initialRightPositionPercent, obj.necessaryPercentRight, percentAnimationDown); // Return value between initialRightPositionPercent and necessaryPercentRight

                            // applied values on real time
                            obj.zoomedElement.style.transform = `scale(${percentScale})`;
                            obj.zoomedElement.style.right = `${percentMarginRight}%`;

                            if (obj.respectSpace) {
                                
                                scaleEl = Number(obj.zoomedElement.style.transform.split('scale(')[1].split(')')[0]);
                                
                                obj.newDiv.style.width = `${obj.zoomedElement.clientWidth * scaleEl}px`;
                                obj.newDiv.style.height = `${obj.zoomedElement.clientHeight * scaleEl}px`;
                                
                                obj.zoomedElement.style.top = `${ruleOfFor(initialOffsetTop, obj.newDiv.offsetTop + ((obj.newDiv.clientHeight - obj.zoomedElement.clientHeight) / 2), percentAnimationUp)}px`;
                                
                                if (obj.secondElement != undefined) {

                                    scaleSecEl = Number(obj.secondElement.el.style.transform.split('scale(')[1].split(')')[0]);
    
                                    // calculate the values of the animation when growing up
                                    percentScaleSec = ruleOfFor(1, obj.secondElement.maxScaleDinSec, percentAnimationDown); // Return value between 1 and maxScaleDin
                                    percentMarginRightSec = ruleOfFor(obj.secondElement.initialRightPositionPercentSec, obj.secondElement.necessaryPercentRightSec, percentAnimationDown); // Return value between initialRightPositionPercent and necessaryPercentRight
    
                                    // applied values on real time
                                    obj.secondElement.el.style.transform = `scale(${percentScaleSec})`;
                                    obj.secondElement.el.style.right = `${percentMarginRightSec}%`;

                                    // modify the substituteSecEl
                                    obj.secondElement.newDivSec.style.width = `${obj.secondElement.el.clientWidth * scaleSecEl}px`;
                                    obj.secondElement.newDivSec.style.height = `${obj.secondElement.el.clientHeight * scaleSecEl}px`;
                                    
                                    obj.secondElement.el.style.top = `${obj.secondElement.newDivSec.offsetTop + ((obj.secondElement.newDivSec.clientHeight - obj.secondElement.el.clientHeight) / 2)}px`;

                                    if (obj.secondElement.invert) {

                                        obj.zoomedElement.style.top = `${ruleOfFor(obj.secondElement.el.offsetTop, obj.zoomedElement.clientHeight / 2, percentAnimationDown)}px`;
                                        obj.secondElement.el.style.top = `${ruleOfFor(obj.secondElement.newDivSec.offsetTop, ((obj.zoomedElement.clientHeight * 2) + (obj.secondElement.el.clientHeight / 2)), percentAnimationDown)}px`;

                                    };

                                };

                            };

                        };

                        // Animation Out
                        if (window.scrollY <= obj.scrollPosition || window.scrollY > obj.scrollPosition + obj.rangeAnimationUp + obj.rangeAnimation + obj.rangeAnimationDown) {

                            // Set default values
                            obj.zoomedElement.style.transform = `scale(1)`;
                            obj.zoomedElement.style.right = `${obj.initialRightPositionPercent}%`;

                            if (obj.respectSpace) {
                                
                                obj.zoomedElement.style.top = `${initialOffsetTop}px`;
                                console.log(initialOffsetTop);
                                obj.newDiv.style.width = zoomedElement.style.width != 'auto' ? zoomedElement.style.width : zoomedElement.offsetWidth + "px";

                                if (obj.secondElement != undefined) {

                                    // Set default values
                                    obj.secondElement.el.style.transform = `scale(1)`;
                                    obj.secondElement.el.style.right = `${obj.secondElement.initialRightPositionPercentSec}%`;
    
                                    obj.secondElement.el.style.top = `${obj.secondElement.newDivSec.offsetTop}px`;
                                    obj.secondElement.newDivSec.style.width = obj.secondElement.el.style.width != 'auto' ? obj.secondElement.el.style.width : obj.secondElement.el.offsetWidth + "px";
                                    
                                };
                            
                            };

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


    for (const element of document.querySelectorAll('.zoomedElement')) {
        zoomedElement(element);
    }
    

});



