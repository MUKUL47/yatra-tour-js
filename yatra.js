export default (function(){
    const YatraIntro = function(elements, config){
        this.elements = elements;
        this.config = config;
        /**
        * check conditionals
        */
        this.yatraElements = filterInitalElements(this.elements);
        this.yatraLimit = yatraElements.length;
    }
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
    YatraIntro.prototype.start = function(){
        console.log(this)
    }
    YatraIntro.prototype.next = function(){
        console.log(this)
    }
    YatraIntro.prototype.skip = function(){ //end
        console.log(this)
    }
    YatraIntro.prototype.previous = function(){
        console.log(this)
    }
    YatraIntro.prototype.jumpTo = function(){
        console.log(this)
    }
    return YatraIntro
}());
const elements = [
    {
        selector : '.text',
        message : 'This is a text message'
    }
]