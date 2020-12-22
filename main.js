const bodyElement = document.querySelector('body');
let yatraIdx = -1;
const limit = document.querySelectorAll('.text').length;
let lastElement = null;
let yatraElements = document.querySelectorAll('.text');
console.log(yatraElements)
let yatraContentModel = null;
const globalHeight = window.screen.height;
const padding = 2.5;
const yatraHoverElement = createOverlay('yatra-hover-element-overlay');
let firstTranisition = false;
function startYatra(){
    resetLastNode()
    const yatraElement = yatraElements[yatraIdx];
    if(!firstTranisition){
        firstTranisition = true;
        yatraElements[yatraIdx].classList.add('yatra-active-place')
        yatraHoverElement.addEventListener('transitionend', () => yatraElements[yatraIdx].classList.add('yatra-active-place'))
    }
    window.scrollTo({ top : yatraElement.offsetTop, left : yatraElement.offsetLeft,  behavior : 'smooth' });
    // const yatraData = Object.values(yatraElement.attributes).find(attr => attr.nodeName === 'yatra-data').value;
    setYatraOverlayDiv(yatraElement)
    toggleYatraModel(yatraElement)
    return yatraElement;
}
function setYatraOverlayDiv(element){
    const properties = element.getClientRects()[0];
    yatraHoverElement.style.width = properties.width+"px";
    yatraHoverElement.style.borderRadius = element.style.borderRadius+"px";
    yatraHoverElement.style.borderCollapse = "separate";
    yatraHoverElement.style.height = properties.height+"px";
    yatraHoverElement.style.left = element.offsetLeft+"px";;
    yatraHoverElement.style.top = element.offsetTop+"px";
}
function toggleYatraModel(element){
    if(yatraContentModel){
        if(!element){
            yatraContentModel.classList.add('yatra-display-none');
            return;
        }
        yatraContentModel.classList.remove('yatra-display-none');
        if(!isDefault(element)){
            yatraContentModel.style.top = `${element.offsetHeight + element.offsetTop}px`; // bottom
        }else{
            yatraContentModel.style.top = `${element.offsetTop - yatraContentModel.offsetHeight}px`; // top
        }
    }
}
function isDefault(element){
    if(window.innerWidth < (element.offsetLeft + yatraContentModel.offsetWidth)){
        yatraContentModel.style.left = `${element.offsetWidth + element.offsetLeft - yatraContentModel.offsetWidth }px`; // right
    }else{
        yatraContentModel.style.left = `${element.offsetLeft}px`;
    }
    return window.innerHeight < element.getClientRects()[0].bottom + yatraContentModel.offsetHeight//check bottom overflow
}
function resetLastNode(){
    if(lastElement) {
        lastElement.classList.remove('yatra-active-place')
    }
}
function createOverlay(classId){
    const overLay = document.createElement('div');
    overLay.classList.add(classId || 'yatra-overlay-div');
    overLay.id = classId || 'yatra-overlay-div'
    return overLay;
}
function createDataModel(){
    return `
    <div id="yatra-data-control" class="yatra-display-none">
        <div class="yatra-data-content">Hey There!!!</div>
        <div class="yatra-data-controls">
            <div id="yatra-data__next">Next</div>
            <div id="yatra-data__back">Back</div>
        </div>
    </div>
    `
}
function initializeYatra(){
    firstTranisition = false;
    first = true
    yatraContentModel = document.getElementById('yatra-data-control');
    document.body.appendChild(createOverlay())
    document.body.appendChild(yatraHoverElement)
    document.querySelector('button').classList.add('yatra-active-place')
}
let first = false;
function resetYatra(){ //remove
    yatraIdx = 0
    document.getElementById('yatra-overlay-div').remove();
    lastElement = null;
    yatraElements.forEach(e => e.classList.remove('yatra-active-place'))
    toggleYatraModel(false)
    //remove listener
}
(function(){
    start()
}())
function start(){
    document.getElementById('yatra-data-holder').innerHTML = createDataModel()
    window.addEventListener('resize', e => toggleYatraModel(lastElement))
    //
    document.getElementById('yatra-data__next').addEventListener('click', e => next())
    document.getElementById('yatra-data__back').addEventListener('click', e => previous())
    next()
}
const ee = [
    {
        selector : '.text',
        message : 'This is a text message1'
    }, {
        selector : '.text1 .text2',
        message : 'This is a text message2'
    }, {
        selector : '.text3',
        message : 'This is a text message3'
    }
]

function filterInitalElements(elements){
    let els = [];
    elements.forEach(element => {
        const selectors = element.selector.split(' ');
        selectors.forEach(selector => {
            els.push({ element : document.querySelector(selector), message : element.message })
        })
    })
    return els;
}
function previous(){
    if(!first) initializeYatra()
    yatraIdx = yatraIdx - 1;
    toggleYatraModel(false)
    if(yatraIdx < limit){
        lastElement = startYatra();
    }else{
        debugger
        resetYatra();
    }
}
function next(){
    if(!first) initializeYatra()
    yatraIdx = yatraIdx + 1;
    toggleYatraModel(false)
    if(yatraIdx < limit){
        lastElement = startYatra();
    }else{
        resetYatra();
    }
}