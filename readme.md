# A simple light weight and easy to use website tour library.</a>

### installation

#### Add CDN for default tour modal (https://npmcdn.com/yatra-tour-js@latest/yatra.css) *required*

### install package
```
npm i yatra-tour-js
```
#### or using script
```
<script src="https://npmcdn.com/yatra-tour-js@latest/index.js" type="text/javascript"></script>
```

### usage
```
const elements = [
    {
        selector : 'someclass',
        message : 'Hi there'
    }, {
        selector : 'someclass1 someclass2',
        message : 'Same message for different classes'
    }
];
const config = {padding : 10, allowSkip : false, overlayOpacity : .3};
const yatra = new YatraIntro(elements, config);
yatra.start()
```

### Optional configs

Config | Definition | Type
--- | --- | ---
padding | Padding between actual tour modal and active element | Number
allowSkip | Skip ongoing tour in between (true by default) |  Boolean
customModal | custom tour modal having %content%, %next_button% & %back_button% as HTML string | String
overlayOpacity | adjust opacity of overlay div | number

### Optional callback

```
new YatraIntro(elements, null, onUserAction.bind(this)).start()
function onUserAction(action){
    //action = next | previous | skipped | completed
}
```

### Custom tour modal template
```
    <div id="yatra-data-control" class="my-own-class">
        <div id="yatra-data-content" class="my-own-message-div-class"></div>
        <div class="my-own-modal-control-class">
            <div id="yatra-data__next">Next</div>
            <div id="yatra-data__back">Back</div>
        </div>
    </div>
```

![Demo](https://github.com/MUKUL47/yatra-tour-js/blob/main/test/tour-demo.gif "Title")
