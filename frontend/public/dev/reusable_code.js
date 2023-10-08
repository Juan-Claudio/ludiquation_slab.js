var equations = [
    ['150', 'y', '(2-y)', '=', '7', '-g'],
            ['2','-h','=','5'],
            ['1351l','-5','×4','=','-1371'],
            ['2g','+4','=','3','(g-1)'],
            ['9','-7','(-1+2)','=','3','(-1+i)'],
            ['k','=','18','(-k+76)'],
            ['h','(-g+4l)','-i','(3-k)','-15','=','-k','+h','-2g','×l']
];

function get_all_blocs_nb()
{
    return equations.reduce(
        function(acc, currVal, id, arr){
            console.log(acc);
            acc = (id===1) ? arr[0].length : acc;
            console.log('after: '+acc);
            return acc+currVal.length;
    });
}

function isContentValid(content, doubleBloc=false)
{
    //preformat content string
    content = /*this.smplySign(*/content.replace(/\s/g,'').toLowerCase()/*)*/;
                
    if(content.length>10){ return 'err:length'; }

    //check if not contains invalid char
    if(/[^a-z0-9\-\+\/\*×÷:\(\),\.]/.test(content)){ return 'err:invalid'; }
    
    //check if parentesis correctly opened and closed
    let parentOpNb = (content.match(/\(/g) ?? []).length;
    let parentClNb = (content.match(/\)/g) ?? []).length;
    if(parentOpNb!==parentClNb){ return 'err:parent'; }
    if(content.indexOf('(')>content.indexOf(')')){ return 'err:parent'; }

    //check first and last char according to type of new bloc
    let firstChar_pattern = /^[,\.\/\*×÷:\)]/;
    if(doubleBloc){ firstChar_pattern = /^[^\+\-\*\/×÷:]/; }
    if(firstChar_pattern.test(content)){ return 'err:firstChar'; }
    if(/[^\)0-9a-z]$/.test(content)){ return 'err:lastChar'; }
    
    //check succession of chars
    if(/[^0-9][,\.]/.test(content)){ return 'err:dot'; }
    if(/[,\.][^0-9]/.test(content)){ return 'err:dot'; }
    if(/[,\.][0-9]+[,\.]/.test(content)){ return 'err:dot'; }
    if(/[\+\-][^a-z0-9\(]/.test(content)){ return 'err:sign'; }
    if(/[\/:÷\*×][^0-9a-z\(\+\-]/.test(content)){ return 'err:op'; }
    if(/[\(][^a-z0-9\+\-\(]/.test(content)){ return 'err:parentOp'; }
    
    return (
        content
        .replace(/,/g,'.')
        .replace(/\*/g,'×')
        .replace(/[÷:]/g,'/')
        );
}

function randomContent()
{
    let alpha='a0×÷-+.,()';
    let first='a0(';
    let allowed='';
    let expr='';
    let k=0;
    let parOp = false;
    for(let i = 0; i<10; i++)
    {
        if(i===0)
        {
            
            allowed = first+'+-'
        }
        else if(i===9)
        {
            
            allowed = (parOp) ? ')' : 'a0'
        }
        else
        { 
            if(expr[i-1]==='0'){ allowed=alpha }
            else if(expr[i-1]==='a'){ allowed = (parOp) ? 'a0×÷-+)' : 'a0×÷-+(' }
            else if(expr[i-1]==='0'){ allowed = (parOp) ? 'a0×÷-+).,' : 'a0×÷-+(.,'}
            else if(/\(/.test(expr[i-1])){ allowed='a0-+' }
            else if(/\)/.test(expr[i-1])){ allowed='a0-+×÷(' }
            else if(/[\+\-]/.test(expr[i-1])){ allowed = (parOp) ? 'a0' : 'a0(' }
            else if(/[×÷]/.test(expr[i-1])){ allowed = (parOp) ? '-+a0' : '-+a0(' }
            else if(/[\.,]/.test(expr[i-1])){ allowed='0' }
        }
        k=Math.floor(Math.random()*allowed.length);
        expr+=allowed[k];
        if(allowed[k]==='('){ parOp=true; }
        else if(allowed[k]===')'){ parOp=false; }
    }
    return [expr, isContentValid(expr)];
}

function test()
{
    let res=[];
    let resAll='';
    for(let i = 0; i<100; i++)
    {
        res=randomContent();
        resAll+=`in:'${res[0]}' out:'${res[1]}'\n`;
    }
    console.info(resAll);
}