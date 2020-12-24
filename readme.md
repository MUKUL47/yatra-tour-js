# A simple light weight and easy to use website tour library.</a>

### installation

#### Add CDN for default tour modal
```
https://npmcdn.com/yatra-tour-js@latest/yatra.css
```
### install package
```
npm i yatra-tour-js
```

### usage
```
import YatraIntro from 'yatra-tour-js'
const elements = [
    {
        selector : '.someclass',
        message : 'Hi there'
    }, {
        selector : '.someclass1 #someclass2',
        message : 'Same message for different ids or classes'
    }
];
const config = {padding : 10, allowSkip : false};
const yatra = new YatraIntro(elements, config);
yatra.start()
```

### Optional configs

Config | Definition | Type
--- | --- | ---
padding | Padding between actual tour modal and active element | Number
allowSkip | Skip ongoing tour in between (true by default) |  Boolean
customModal | custom tour modal having %content%, %next_button% & %back_button% as HTML string | String


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