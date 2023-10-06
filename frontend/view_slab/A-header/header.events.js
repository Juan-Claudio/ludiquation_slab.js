import Events from "../../Events.js";

export default function(data)
{
    Events.export({
        console_show_hide: function(selector, score_or_level)
            {
                console.log(`%c${score_or_level}:%c `+data[score_or_level],'color:#7864ff;font-weight:bold;');
                if($(selector).css('display')==='none'){ console.log('SHOW');$(selector).show(); }
                else{ $(selector).hide(); }
            }
        });
    
    Events.listen({
        '.ludi-header-score': ['click', function(){ Events.evfonctions.console_show_hide('.ludi-header-score', 'score') }],
        '.ludi-header-level': ['click', function(){ Events.evfonctions.console_show_hide('#test', 'level') }]
    });
}