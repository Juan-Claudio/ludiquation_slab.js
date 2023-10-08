export default function(data)
{
    return {
        '.ludi-actions':['click',function(){
            $(".ludinewbloc").show(800, ()=>{
                $("#newBlocContent").trigger('focus');
            });
        }]
    };
}