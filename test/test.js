const elements = [
    {
        selector : '1',
        message : `Modal is placed based on free space priority 
        (BOTTOM, TOP, LEFT, RIGHT and in between with opacity 0.5 since there's no space`
    },
    {
        selector : '3',
        message : 'Outline is adjusted automatically'
    },
    {
        selector : '2',
        message : 'Same Message for 2 different classes'
    },
    {
        selector : '5',
        message : 'Auto scroll into view'
    }
]
new YatraIntro(elements, {allowSkip : true, padding : 20, overlayOpacity : .2}).start()

