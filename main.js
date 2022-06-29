window.addEventListener('DOMContentLoaded', () => {

    // Set values here
    const minWidth = 0;
    const maxWidth = 10000;
    const startEarlier = 200; // Set this number in px to start earlier the animation (if you set this number as negative the animation will start later)
    const startFromCenter = true; // Set true to start count when the element is in the middle to the window, set false for count from the top of the element. Note: if set in true, no use the class "zoomedElementScroll"
    const rangeAnimationUp = 100; // Set this number in pixels to set the animation's growth range.
    const rangeAnimation = 150; // Set this number in pixels to set the duration of animation's growth range.
    const rangeAnimationDown = 100; // Set this number in pixels to set the decay range of the animation.
    // Set values here
    
    const bodyElement = document.querySelector('body');
    const zoomedElementParent = document.querySelector('.zoomedElementParent');
    const zoomedElement = document.querySelector('.zoomedElement');
    const zoomedElementScroll = document.querySelector('.zoomedElementScroll');
    let scrollPosition = zoomedElement.offsetTop;
    if( zoomedElementScroll != null ) scrollPosition = zoomedElementScroll.offsetTop;

    let percentAnimationUp = 0;
    let percentAnimationDown = 0;

    let percentScale = 1;
    let percentMarginRight = 0;
    
    let maxScaleDin = 0;
    let marginRightDin = 0;
    
    
    const zoomedElementFn = () => {
        if (window.innerWidth > minWidth && window.innerWidth < maxWidth) {
            scrollPosition = zoomedElement.offsetTop;
            if( zoomedElementScroll != null ) scrollPosition = zoomedElementScroll.offsetTop;
            
            if (startFromCenter) {
                if( zoomedElementScroll == null ) scrollPosition = scrollPosition - (window.innerHeight / 2) + (zoomedElement.clientHeight / 2);
                else                              scrollPosition = scrollPosition - (window.innerHeight / 2) + (zoomedElementScroll.clientHeight / 2);
            }

            scrollPosition -= startEarlier;

            // create substitute div
            let newDiv = document.createElement('DIV')
            newDiv.style.width = zoomedElement.offsetWidth + "px"
            newDiv.style.height = zoomedElement.offsetHeight + "px"
            zoomedElementParent.insertBefore(newDiv, zoomedElement);
            console.log(newDiv.getBoundingClientRect());

            // calculate maximum scale
            maxScaleDin = bodyElement.clientWidth / zoomedElement.clientWidth;
            marginRightDin = (bodyElement.clientWidth - zoomedElement.clientWidth) / 2;

            window.onscroll = function (e) {

                // Animation Up
                if (window.scrollY >= scrollPosition && window.scrollY < scrollPosition + rangeAnimationUp) {

                    // calculate the percent of the animation according with the rangeAnimationUp
                    percentAnimationUp = (((window.scrollY - scrollPosition) / rangeAnimationUp) * 100)

                    // calculate the values of the animation when growing up
                    percentScale = ((maxScaleDin - 1) / (100 / percentAnimationUp)) + 1 // Return value between 1 and maxScaleDin
                    percentMarginRight = (percentAnimationUp * marginRightDin) / 100

                    // applied values on real time
                    zoomedElement.style.transform = `scale(${percentScale})`;
                    zoomedElement.style.right = `${percentMarginRight}px`;

                }
                
                // Animation Keep
                if (window.scrollY >= scrollPosition + rangeAnimationUp && window.scrollY < scrollPosition + rangeAnimationUp + rangeAnimation) {

                    zoomedElement.style.transform = `scale(${maxScaleDin})`;
                    zoomedElement.style.right = `${marginRightDin}px`;

                };

                // Animation Down
                if (window.scrollY >= scrollPosition + rangeAnimationUp + rangeAnimation && window.scrollY < scrollPosition + rangeAnimationUp + rangeAnimation + rangeAnimationDown) {
                    
                    // calculate the percent of the animation according with the rangeAnimationDown (Added this expression " - 100) * -1) " to invert )
                    percentAnimationDown = ((((window.scrollY - (scrollPosition + rangeAnimationUp + rangeAnimation)) / rangeAnimationDown) * 100) - 100) * -1

                    // calculate the values of the animation when decreasing
                    percentScale = ((maxScaleDin - 1) / (100 / percentAnimationDown)) + 1 // Return value between 1 and maxScaleDin
                    percentMarginRight = (percentAnimationDown * marginRightDin) / 100

                    // applied values on real time
                    zoomedElement.style.transform = `scale(${percentScale})`;
                    zoomedElement.style.right = `${percentMarginRight}px`;

                };

                // Animation Out
                if (window.scrollY <= scrollPosition || window.scrollY > scrollPosition + rangeAnimationUp + rangeAnimation + rangeAnimationDown) {

                    // Set default values
                    zoomedElement.style.transform = `scale(1)`;
                    zoomedElement.style.right = `0px`;

                }

                
            } 

        }
    }
    
    


    
    
   
    
    
    
    
    
    
    
    zoomedElementFn()
    window.addEventListener('resize', zoomedElementFn);


    // const btn = document.querySelector('#btn')
    // btn.addEventListener('click', () => {
    //     console.log(scrollPositionEl)
    // })


});



