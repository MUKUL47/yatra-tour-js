import YatraIntro from '../index';
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
const yatra = new YatraIntro(elements, {});
yatra.start()