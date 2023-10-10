import { Html } from '../../../../libs/slab.js';

//data.score, data.level
export default function(data)
{
    const header = new Html();

    header
    .header({class:'ludi-header'})
        .h1({class:'ludi-header-title'}).text('Ludiquation').end()
        .div({class:'ludi-header-score_level'})
            .div({class:'ludi-header-score'}).text('Score: '+data.score).end()
            .btn({id:'combine2blocs', class:'my-1 header-btn', title:'2nd block content in first block'})
                .img({class:'w-32px', alt:'two squares at the bottom, arrow on the top, from left square to right square', src:'frontend/public/img/combine.png'})
            .end()
            .img({class:'ludi-actions w-32px', alt:'keyboard black keys', src:'frontend/public/img/keyboard_bootstrap.svg', role:'button', 'arial-label':'open input', title:'open input'})
            .btn({id:'remove2blocs', class:'my-1 header-btn', title:'cancel two blocks each other out'}).text('✗').end()
            .div({class:'ludi-header-level', id:"test"}).text('Level: '+data.level).end()

    .end('all')

    return header.export;
}
