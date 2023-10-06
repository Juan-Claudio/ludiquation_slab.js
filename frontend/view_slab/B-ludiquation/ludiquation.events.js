import ludiquationHtml from "./ludiquation.html.js";
import ludiquationCss from "./ludiquation.css.js";
import PlayerActions from "./../../controller/PlayerActions.js";
export default function(data)
{   
    function reverseEquation(){
        let eq_id = $(this).attr('id').replace(/b\d+/g,'').replace(/eq/g,'');
        PlayerActions.reverseEquation(eq_id);
        //TODO refresh slab !!
    }
    const html = ludiquationHtml(data.equations);
    const css = ludiquationCss();
    const events = {
        '.bloc:contains(=)': ['click', reverseEquation],
    };

    return {html, css, events};
}