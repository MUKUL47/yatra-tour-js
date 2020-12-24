const YatraIntro = (()=>{
    let yatraElements = null //will hold elements in pattern
    let transitionListener = null  //init transitionListener to cb 'transitionend'
    let yatraFlow = null //reset yatra flow
    let yatraActiveIdx = -1 //active yatra index
    let yatraContentModel = null //will hold content model (data, skip, next, previous)
    let yatraHoverElement = null //will hold hover outlining active element
    let lastElement = null
    let yatraDataContent = null;
    //--
    let padding = 5; //padding btw active element and modal
    let customModalString = null;
    let allowSkip = true;
    //-
    let contentDiv = null;
    let nextBtn = null;
    let backBtn = null;

    const YatraIntro = function(elements, config){
        yatraElements = filterInitalElements(elements)
        //init config
        if(config && typeof config === 'object'){
            if(config.padding && typeof config.padding == 'number'){
                padding = config.padding;
            }
            if(Object.keys(config).includes('allowSkip')){
                allowSkip = config.allowSkip;
            }
            if(config.customModal){
                if(validateCustomDataModel(config.customModal)){
                    customModalString = config.customModal;
                }else{
                    console.warn('Invalid custom modal, reverting to default settings...')
                }
            }
        }
    }
    YatraIntro.prototype.start = function(){
        initializeYatraFlow();
        next();
    }
    YatraIntro.prototype.next = function(){
        next();
    }
    YatraIntro.prototype.skip = function(){ 
        resetFlow();
    }
    YatraIntro.prototype.previous = function(){
        previous()
    }
    YatraIntro.prototype.jumpTo = function(index){
        if(yatraActiveIdx === -1){
            initializeYatraFlow()
        }
        if(index >= 0 && index <= yatraElements.length - 1){
            yatraActiveIdx = Number(index)
            lastElement = startYatra()
            modalControls()
            onResizeYatraL()
            return;
        }
        console.warn('Invalid index')
    }
    return YatraIntro;
    //helpers
    function createOverlay(classId){
        const overLay = document.createElement('div');
        overLay.classList.add(classId);
        overLay.id = classId;
        document.body.appendChild(overLay)
        return overLay;
    }
    function initializeYatraFlow(){
        yatraActiveIdx = -1;
        yatraElements = filterInitalElements(elements);
        if(customModalString){
            document.body.innerHTML += customModalString
        }else{
            document.body.innerHTML += createDataModel()
        }
        
        contentDiv = document.getElementById('yatra-data-control')
        nextBtn = document.getElementById('yatra-data__next')
        backBtn = document.getElementById('yatra-data__back')
        yatraContentModel = document.getElementById('yatra-data-control'); //or init from user custom
        yatraHoverElement = createOverlay('yatra-hover-element-overlay') //outline of active element
        const overFlow = createOverlay('yatra-overlay-div') //overlay div to hide unwanted elements
        if(!allowSkip){
            overFlow.style.cursor = 'none';
        }
        initializeListeners();
    }
    function filterInitalElements(elements){
        let els = [];
        elements.forEach((element, mainId) => {
            const selectors = element.selector.split(' ');
            selectors.forEach((selector, selectorId) => {
                [...document.getElementsByClassName(selector)].forEach((ee, id) => {
                    const classId = `YATRA-${mainId}-${selectorId}-${id}`;
                    ee.classList.add(classId)
                    els.push({ element : classId, message : element.message, e : document.getElementsByClassName(classId)[0] })
                })
            })
        })
        return els;
    }
    function createDataModel(){//default data model IFF not provided
        return `
        <div id="yatra-data-control" class="yatra-data-control">
            <div id="yatra-data-content">123</div>
            <div class="yatra-data-controls">
                <div id="yatra-data__next">Next</div>
                <div id="yatra-data__back">Back</div>
            </div>
        </div>
        `
    }
    function onResizeYatraL(){
        toggleYatraModel(lastElement)
        const ele = yatraElements[yatraActiveIdx];
        if(ele){
            setYatraOverlayDiv(document.getElementsByClassName(ele.element)[0])
        }
    }
    function onOverlayClick(){
        if(allowSkip){
            resetFlow();
        }
    }
    function next(){
        if(yatraActiveIdx < yatraElements.length - 1){
            yatraActiveIdx += 1;
            modalControls()
            lastElement = startYatra()
            return;
        }
        resetFlow();
    }
    function previous(){
        if(yatraActiveIdx > 0){
            yatraActiveIdx -= 1;
            lastElement = startYatra()
        }
        modalControls()
    }
    function initializeListeners(){
        window.addEventListener('resize', onResizeYatraL, true)
        document.getElementById('yatra-overlay-div').addEventListener('click', onOverlayClick.bind(this))
        nextBtn.addEventListener('click', next.bind(this), true)
        backBtn.addEventListener('click', previous.bind(this), true)
    }
    function removeListeners(){
        window.removeEventListener('resize', onResizeYatraL, true)
        document.getElementById('yatra-overlay-div').removeEventListener('click', onOverlayClick.bind(this))
        yatraHoverElement.removeEventListener('transitionend',()=>{});
        yatraElements.forEach(e => document.getElementsByClassName(e.element)[0].classList.remove(e.element))
        nextBtn.removeEventListener('click', next.bind(this), true)
        backBtn.removeEventListener('click', previous.bind(this), true)
    }
    function resetFlow(){
        yatraActiveIdx = -1;
        transitionListener = false;
        removeListeners()
        document.getElementById('yatra-data-control').remove();
        document.getElementById('yatra-hover-element-overlay').remove();
        document.getElementById('yatra-overlay-div').remove();
        resetLastNode();
    }
    function startYatra(){
        resetLastNode()
        const yatraElement = document.getElementsByClassName(yatraElements[yatraActiveIdx].element)[0];
        if(!transitionListener){
            transitionListener = true;
            yatraElement.classList.add('yatra-active-place')
            yatraHoverElement.addEventListener('transitionend', () => {
                const E = document.getElementsByClassName(yatraElements[yatraActiveIdx].element)[0];
                E.classList.add('yatra-active-place')
            })
        }
        window.scrollTo({ top : yatraElement.offsetTop, left : yatraElement.offsetLeft,  behavior : 'smooth' });
        // const yatraData = Object.values(yatraElement.attributes).find(attr => attr.nodeName === 'yatra-data').value;
        setYatraOverlayDiv(yatraElement)
        toggleYatraModel(yatraElement)
        return yatraElement;
    }
    
    function modalControls(){
        if(yatraActiveIdx === 0){
            backBtn.style.opacity = '0'
            backBtn.style.pointerEvents = 'none'
        }else{
            backBtn.style.opacity = '1'
            backBtn.style.pointerEvents = 'all'
        }
        if(yatraActiveIdx === yatraElements.length - 1){
            nextBtn.innerHTML = 'Done'
        }else{
            nextBtn.innerHTML = 'Next'
        }
    }
    
    function setYatraOverlayDiv(element){
        window.elementelement = element
        const properties = element.getClientRects()[0];
        yatraHoverElement.style.width = properties.width+"px";
        yatraHoverElement.style.borderRadius = element.style.borderRadius;
        yatraHoverElement.style.height = properties.height+"px";
        yatraHoverElement.style.left = element.offsetLeft+"px";
        yatraHoverElement.style.top = element.offsetTop+"px";
    }
    function toggleYatraModel(element){
        if(yatraContentModel){
            if(!element){
                yatraContentModel.classList.add('yatra-display-none');
                return;
            }
            yatraContentModel.classList.remove('yatra-display-none');
            calculatePosition(element);
        }
    }
    function calculatePosition(element){
        //priority BOTTOM TOP RIGHT LEFT
        const elementCoords = element.getClientRects()[0];
        yatraContentModel.classList.remove('yatra-modal-in-between')
        const dom = document.querySelector('html');
        const fullWidth = dom.scrollWidth;
        const fullHeight = dom.scrollHeight;
        if(elementCoords.bottom + yatraContentModel.offsetHeight + padding< fullHeight){ 
            //bottom free
            yatraContentModel.style.top = `${element.offsetTop + element.offsetHeight + padding}px`;
            if(element.offsetLeft + yatraContentModel.offsetWidth < fullWidth){
                yatraContentModel.style.left = `${element.offsetLeft}px`;
            }else{
                yatraContentModel.style.left = `${ elementCoords.right - yatraContentModel.offsetWidth }px`;
            }
            return
        }
        if(elementCoords.top - yatraContentModel.offsetHeight - padding > 0){ 
            //top free
            yatraContentModel.style.top = `${element.offsetTop - yatraContentModel.offsetHeight - padding}px`;
            if(elementCoords.left + yatraContentModel.offsetWidth < fullWidth){
                yatraContentModel.style.left = `${elementCoords.left}px`;
            }else{
                yatraContentModel.style.left = `${ elementCoords.right - yatraContentModel.offsetWidth}px`;
            }
            return
        }
        if(elementCoords.right + yatraContentModel.offsetWidth + padding < fullWidth){ 
            //right free
            yatraContentModel.style.top = `${elementCoords.top }px`;
            yatraContentModel.style.left = `${ elementCoords.left + elementCoords.width + padding}px`;
            return
        }
        else if(elementCoords.left - yatraContentModel.offsetWidth - padding > 0){ //left free
            yatraContentModel.style.top = `${elementCoords.top}px`;
            yatraContentModel.style.left = `${ elementCoords.left - yatraContentModel.offsetWidth - padding }px`;
        }
        else{
            //inside element to avoid overflow - worst case :(
            yatraContentModel.style.top = `${elementCoords.top}px`;
            yatraContentModel.style.left = `${ elementCoords.left}px`;
            yatraContentModel.classList.add('yatra-modal-in-between')
        }
    }
    function resetLastNode(){
        if(lastElement) {
            lastElement.classList.remove('yatra-active-place')
        }
    }

    function validateCustomDataModel(innerHtml){
        try{
            const customModal = document.createElement('div');
            customModal.classList.add('validating-custom-modal');
            customModal.innerHTML = innerHtml;
            return customModal.querySelector('validating-custom-modal>#yatra-data-control') &&//main modal
            customModal.querySelector('#yatra-data-control>#yatra-data-content') && //content
            customModal.querySelector('#yatra-data-control>#yatra-data__next') && //next btn
            customModal.querySelector('#yatra-data-control>#yatra-data__back'); //back btn
        }catch(e){
            return false;
        }
    }
})();
export default YatraIntro;