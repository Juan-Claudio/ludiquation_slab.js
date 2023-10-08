import { jquery_fct } from '../../libs/slab.js';
import { header_data, ludiwindow_data } from './model/app_var.js';
import header from './view_slab/A-header/header.js';
import ludinewbloc from './view_slab/A-ludinewbloc/ludinewbloc.js';
import ludiwindow from './view_slab/A-ludiwindow/ludiwindow.js';

jquery_fct(); //import jquery

//jquery on document ready
$( function(){
    header.insert_version('ludihead', header_data);
    ludiwindow.insert_version('ludiwin', ludiwindow_data);
    ludinewbloc.insert_version('ludinewbloc');
})
