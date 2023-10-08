import Interactions from "../../../backend/controller/Interactions.js";

export default function(data)
{
    return {
        'onInit': function(){
            $('.ludinewbloc').hide();
        },

        '#validate_1newBloc': ['click', function(){
            let mess =  Interactions.replaceSelectionByNewBloc(
                $('#newBlocContent').val()
            );
            alert(Interactions.trad(mess));
            if(mess==='correct' || mess=='err:noBlocSelected')
            {
                Interactions.unselectAll();
                $('.ludinewbloc').hide();
            }
        }],

        '#validate_2newBlocs': ['click', function(){
            let mess = Interactions.addDoubleBloc(
                $('#newBlocContent').val()
            );

            switch(mess)
            {
                case 'err:firstChar':
                    alert('First character must be operation sign.');
                    return;
                case 'err:noBlocSelectedEq':
                case 'correct':
                    Interactions.unselectAll();
                    $('.ludinewbloc').hide();
                    if(mess==='correct'){ return }
                default:
                    alert(Interactions.trad(mess));
                    break;
            }
        }],

        '#close_input-btn':['click', function(){
            $('.ludinewbloc').hide();
        }]
    };
}
