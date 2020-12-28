const YatraIntro = (()=>{
    let yatraElements = null 
    let transitionListener = null 
    let yatraActiveIdx = -1
    let yatraContentModel = null 
    let yatraHoverElement = null 
    let lastElement = null
    let padding = 5; 
    let customModalString = null;
    let allowSkip = true;
    let contentDiv = null;
    let nextBtn = null;
    let backBtn = null;
    let overlayOpacity = null;
    const dom = document.querySelector('html');
    let fullWidth = dom.scrollWidth;
    let fullHeight = dom.scrollHeight;
    let callback;
    /**
     * @param {Array} elements array containing selector(s) and message
     * @param {Object} config { 
     * allowSkip : boolean(will skip tour on click of overlay div), 
     * padding : number(padding between active element and tour message), 
     * customModal : string(HTML string for custom tour modal),
     * overlayOpacity : number(overlay div opacity)}
     */
    const YatraIntro = function(elements, config, cb){
        this.elements = elements;
        callback = typeof cb === 'function' ? cb : null;
        yatraElements = filterInitalElements(elements)
        if(config && typeof config === 'object'){
            if(Object.keys(config).includes('allowSkip')){
                allowSkip = config.allowSkip;
            }
            if(config.customModal){
                if(validateCustomDataModel(config.customModal)){
                    customModalString = config.customModal;
                }else{
                    console.error('Invalid custom modal, reverting to default modal')
                }
            }
            padding = config.padding && typeof config.padding == 'number' ? config.padding : null;
            overlayOpacity = config.overlayOpacity && typeof config.overlayOpacity === 'number' ? config.overlayOpacity : null;
        }
    }
    function sendCallBack(type){
        if(callback) callback(type)
    }
    YatraIntro.prototype.start = function(){
        if(contentDiv) {
            console.error('tour already running')
            return
        }
        initializeYatraFlow(this.elements);
        next();
    }
    YatraIntro.prototype.next = function(){
        next();
    }
    YatraIntro.prototype.skip = function(){ 
        resetFlow();
        sendCallBack('skipped')
    }
    YatraIntro.prototype.previous = function(){
        previous()
        sendCallBack('previous')
    }
    YatraIntro.prototype.activeElement = function(){
        return yatraElements[yatraActiveIdx].e;
    }
    YatraIntro.prototype.getAttractions = function(){
        return yatraElements;
    }
    YatraIntro.prototype.jumpTo = function(index){
        if(index >= 0 && index <= yatraElements.length - 1){
            if(yatraActiveIdx === -1){
                initializeYatraFlow(this.elements)
                yatraActiveIdx = Number(index)
                lastElement = startYatra()
                modalControls()
                onResizeYatraL()
            }
            return;
        }
        console.error(`Invalid index ${index}`)
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
    function initializeYatraFlow(elements){
        yatraActiveIdx = -1;
        yatraElements = filterInitalElements(elements);
        document.body.innerHTML += customModalString ? customModalString : createDataModel()
        contentDiv = document.getElementById('yatra-data-content')
        nextBtn = document.getElementById('yatra-data__next')
        backBtn = document.getElementById('yatra-data__back')
        yatraContentModel = document.getElementById('yatra-data-control'); //or init from user custom
        yatraHoverElement = createOverlay('yatra-hover-element-overlay') //outline of active element
        const overFlow = createOverlay('yatra-overlay-div') //overlay div to hide unwanted elements
        overFlow.style.cursor = allowSkip ? 'pointer' : 'auto';
        overFlow.style.opacity = overlayOpacity || .5;
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
                    let EEE = document.getElementsByClassName(classId)[0];
                    els.push({ element : classId, message : element.message, e : EEE })
                })
            })
        })
        return els;
    }
    function createDataModel(){//default data model IFF not provided
        return `
        <div id="yatra-data-control" class="yatra-data-control">
            <div id="yatra-data-content"></div>
            <div class="yatra-data-controls">
                <div id="yatra-data__next">Next</div>
                <div id="yatra-data__back">Back</div>
            </div>
        </div>
        `
    }
    function onResizeYatraL(){
        fullWidth = dom.scrollWidth;
        fullHeight = dom.scrollHeight;
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
            if(yatraActiveIdx > 0){
                sendCallBack('next')
            }
            return;
        }
        sendCallBack('completed')
        resetFlow();
    }
    function previous(){
        if(yatraActiveIdx > 0){
            yatraActiveIdx -= 1;
            lastElement = startYatra()
            sendCallBack('previous')
        }
        modalControls()
    }
    function initializeListeners(){
        window.addEventListener('resize', onResizeYatraL, true)
        document.getElementById('yatra-overlay-div').addEventListener('click',() => {
            onOverlayClick()
            sendCallBack('skipped')
        })
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
        yatraElements = null 
        transitionListener = null 
        yatraActiveIdx = -1
        yatraContentModel = null 
        yatraHoverElement = null 
        lastElement = null
        customModalString = null;
        allowSkip = true;
        contentDiv = null;
        nextBtn = null;
        backBtn = null;
        overlayOpacity = null;
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
        contentDiv.innerHTML = yatraElements[yatraActiveIdx].message;
        toggleYatraModel(yatraElement)
        setYatraOverlayDiv(yatraElement)
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
        yatraContentModel.classList.remove('yatra-modal-in-between')
        const space = yatraElements[yatraActiveIdx].space;
        const findXAxis = () => {
            if(element.offsetLeft + yatraContentModel.offsetWidth < fullWidth){
                yatraContentModel.style.left = `${element.offsetLeft}px`;
            }else{
                yatraContentModel.style.left = `${ (element.offsetLeft + element.offsetWidth) - yatraContentModel.offsetWidth}px`;
            }
        }
        if(yatraContentModel.offsetHeight + padding < fullHeight - (element.offsetTop + element.offsetHeight)){ 
            yatraContentModel.style.top = `${element.offsetTop + element.offsetHeight + padding}px`;
            findXAxis()
        }
        else if(yatraContentModel.offsetHeight + padding < element.offsetTop){ 
            //top free
            yatraContentModel.style.top = `${element.offsetTop - yatraContentModel.offsetHeight - padding}px`;
            findXAxis()
        }
        else if(yatraContentModel.offsetWidth + padding < fullWidth - (element.offsetLeft + element.offsetWidth)){ 
            //right free
            yatraContentModel.style.top = `${element.offsetTop}px`;
            yatraContentModel.style.left = `${ element.offsetLeft + element.offsetWidth + padding}px`;
            return
        }
        else if(yatraContentModel.offsetWidth + padding < element.offsetLeft){ //left free
            yatraContentModel.style.top = `${element.offsetTop}px`;
            yatraContentModel.style.left = `${ element.offsetLeft - yatraContentModel.offsetWidth - padding }px`;
        }
        else{
            //inside
            yatraContentModel.style.top = `${element.offsetTop}px`;
            yatraContentModel.style.left = `${ element.offsetLeft}px`;
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
if(typeof module !== 'undefined' && module.exports) {
    module.exports.YatraIntro = YatraIntro
}