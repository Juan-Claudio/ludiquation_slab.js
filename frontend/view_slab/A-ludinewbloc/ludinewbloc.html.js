import { Html } from "../../../../libs/slab.js";

//data description
export default function(data)
{
    return (
        new Html()
        .div({class:"ludinewbloc"})
            .btn({id:'validate_2newBlocs', class:'my-1 ludi-btn'}).text('↪ = ↩').end()
            .input({id:'newBlocContent', class:'my-1 ludi-btn', type:'text', placeholder:"Bloc(s) content.", pattern:'[a-z0-9\\+\\-\\/\\*×:÷\\(\\)]{1,8}'})
            .btn({id:'validate_1newBloc', class:'my-1 ludi-btn'}).text('= □ ⬚').end()
            .btn({id:'close_input-btn', class:'close-btn'}).text('×').end()
            //ADD custom keyboard of 40 keys [a-z0-9+-÷×]
        .end()
        .export
    );
}
