import headerEvents from './view_slab/A-header/header.events.js';
export default class Events
{
    static evfunctions = {};


    static init(){/*events on init*/}

    static listen(data_event)
    {
        for(let selector in data_event)
        {
            //console.log(`$("${selector}").on("${data_event[selector][0]}", ${data_event[selector][1]})`)
            $(selector).on(data_event[selector][0], function(){console.log('MERDE')});
        }
    }

    static export(evfctions)
    {
        for(let evfct_name in evfctions)
        {
            this.evfunctions[evfct_name] = evfctions[evfct_name];
        }
    }
}