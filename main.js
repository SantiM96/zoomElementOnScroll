window.addEventListener('DOMContentLoaded', () => {


    // Set values here
    const minWidth = 0;
    const maxWidth = 10000;
    const startEarlier = 50; // Set this number in px to start earlier the animation (if you set this number as negative the animation will start later)
    const startFromCenter = true; // Set true to start count when the element is in the middle to the window, set false for count from the top of the element. Note: if set in true, no use the class "zoomedElementScroll"
    // Set values here
    
    const bodyElement = document.querySelector('body');
    const zoomedElementParent = document.querySelector('.zoomedElementParent');
    const zoomedElement = document.querySelector('.zoomedElement');
    const zoomedElementScroll = document.querySelector('.zoomedElementScroll');
    let scrollPosition = zoomedElement.offsetTop;
    if( zoomedElementScroll != null ) scrollPosition = zoomedElementScroll.offsetTop;
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

            window.onscroll = function (e) {


                if (window.scrollY > (scrollPosition - startEarlier)) {
                    console.log("start");

                    // calcular scale máximo
                    maxScale = bodyElement.clientWidth / zoomedElement.clientWidth
                    marginRightDin = zoomedElement.clientWidth / 2
                    


                    // establecer rango desde slcale 1 al máximo en porcentaje

                    // ejecutar animación en funcion al procentaje por el scroll


                    zoomedElement.style.transform = `scale(${maxScale})`
                    zoomedElement.style.marginRight = `${marginRightDin}px`


                    if (window.scrollY > (scrollPosition - startEarlier) + 100) {
                        console.log("end")
                    }
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