import Interactions from "../../../backend/controller/Interactions.js";
import ludiscreencess from "../A-ludiscreencess/ludiscreencess.js";

export default function(data)
{
    return {
        '.ludi-actions':['click',function(){
            $(".ludinewbloc").show(800, ()=>{
                let input = document.getElementById('newBlocContent');
                $("#newBlocContent").trigger('focus');
                input.setSelectionRange(0,input.value.length);
            });
        }],
        '#remove2blocs':['click',function(){
            let mess = Interactions.remove2blocs();
            if(mess!=='correct'){ alert(Interactions.trad(mess)); }
            else
            {
                Interactions.unselectAll();
                ludiscreencess.alert();
            }
        }],
        '#combine2blocs':['click',function(){
            let mess = Interactions.combine2blocs();
            if(mess!=='correct'){ alert(Interactions.trad(mess)); }
            else{ Interactions.unselectAll(); }
        }]
    };
}