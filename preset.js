const elements = [
    {
        selector : 'text',
        message : 'This is a text message1'
    }, {
        selector : 'text1 text2',
        message : 'This is a text message2'
    }, {
        selector : 'text3',
        message : 'This is a text message3'
    }
]
//INIT-VARS-START
let yatraElements = null //will hold elements in pattern
let transitionListener = null  //init transitionListener to cb 'transitionend'
let yatraFlow = null //reset yatra flow
let yatraActiveIdx = -1 //active yatra index
//HTML MODELS
let yatraContentModel = null //will hold content model (data, skip, next, previous)
let yatraHoverElement = null //will hold hover outlining active element
let lastElement = null
let padding = 8; //padding btw active element and modal
//INIT-VARS-END

// -----------------------------------------------------------------

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
function setYatraOverlayDiv(element){
    window.elementelement = element
    const properties = element.getClientRects()[0];
    yatraHoverElement.style.width = properties.width+"px";
    yatraHoverElement.style.borderRadius = element.style.borderRadius;
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
            yatraContentModel.style.top = `${element.offsetHeight + element.offsetTop + padding}px`; // bottom
        }else{
            yatraContentModel.style.top = `${element.offsetTop - yatraContentModel.offsetHeight - padding}px`; // top
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
//-------------------------------------------------------------------

function filterInitalElements(elements){
    let els = [];
    elements.forEach((element, id) => {
        const selectors = element.selector.split(' ');
        selectors.forEach((selector, selectorId) => {
            const es = [...document.getElementsByClassName(selector)];
            es.forEach((ee, id1) => {
                const classId = `YATRA-ID-${id}-${selectorId}-${id1}`;
                ee.classList.add(classId)
                els.push({ element : classId, message : element.message, e : document.getElementsByClassName(classId)[0] })
            })
        })
    })
    return els;
}

function createDataModel(){//default data model IFF not provided
    return `
    <div id="yatra-data-control" class="yatra-data-control yatra-display-none">
        <div class='yatra-data-close'>
            <div id="yatra-data-close-modal">x</div>
        </div>
        <div id="yatra-data-content">Hey There!!!</div>
        <div class="yatra-data-controls">
            <div id="yatra-data__next" onclick="next()">Next</div>
            <div id="yatra-data__back" onclick="previous()">Back</div>
        </div>
    </div>
    `
}
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
    window.yatraElementsyatraElements = yatraElements;
    document.body.innerHTML += createDataModel()
    yatraContentModel = document.getElementById('yatra-data-control'); //or init from user custom
    yatraHoverElement = createOverlay('yatra-hover-element-overlay') //outline of active element
    createOverlay('yatra-overlay-div') //overlay div to hide unwanted elements
    initListeners();
}
function onResizeYatraL(){
    setYatraOverlayDiv(document.getElementsByClassName(yatraElements[yatraActiveIdx].element)[0])
    toggleYatraModel(lastElement)
}
function onOverlayClick(){
    resetFlow();
}
function initListeners(){
    window.addEventListener('resize', onResizeYatraL.bind(this))
    document.getElementById('yatra-overlay-div').addEventListener('click', onOverlayClick.bind(this))
}
function removeListeners(){
    console.log('removing listeners')
    window.removeEventListener('resize', onResizeYatraL.bind(this))
    document.getElementById('yatra-overlay-div').removeEventListener('click', onOverlayClick.bind(this))
    yatraHoverElement.removeEventListener('transitionend',()=>{});
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
function resetFlow(){
    yatraActiveIdx = -1;
    transitionListener = false;
    removeListeners()
    document.getElementById('yatra-data-control').remove();
    document.getElementById('yatra-hover-element-overlay').remove();
    document.getElementById('yatra-overlay-div').remove();
    resetLastNode();
}
function modalControls(){
    let yatraModalBack = document.getElementById('yatra-data__back');
    let yatraModalNext = document.getElementById('yatra-data__next');
    if(yatraActiveIdx === 0){
        yatraModalBack.style.opacity = '0'
        yatraModalBack.style.pointerEvents = 'none'
    }else{
        yatraModalBack.style.opacity = '1'
        yatraModalBack.style.pointerEvents = 'all'
    }
    if(yatraActiveIdx === yatraElements.length - 1){
        yatraModalNext.innerHTML = 'Finish'
    }else{
        yatraModalNext.innerHTML = 'Next'
    }
}
///////////////////////////////////
function nav(){
    initializeYatraFlow();
    next();
}
c = 0;
const onNav = () =>{
    const v = document.getElementById('1').value;
    if(yatraActiveIdx === -1){
        initializeYatraFlow()
    }
    if(v>=0 && v<= yatraElements.length - 1){
        yatraActiveIdx = Number(v)
        lastElement = startYatra()
        modalControls()
    }
}