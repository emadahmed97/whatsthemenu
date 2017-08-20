import '../sass/style.scss';

import { $, $$ } from './modules/bling';

import autocomplete from './modules/autocomplete';
import typeAhead from './modules/typeAhead';
import makeMap from './modules/map';
import ajaxHeart from './modules/heart';
import frontend from './modules/frontend';

const $$$ = require('jquery');


typeAhead( $('.search') );
autocomplete( $('#address'), $('#lat'), $('#lng') );

makeMap( $('#map') );

const modal = $$('form.openModal');
modal.on('submit', frontend);

const heartForms = $$('form.heart');
heartForms.on('submit', ajaxHeart);

$$$('.rating-stars input').on('change',function () {
  var $$$radio = $$$(this);
  $$$('.rating-stars .selected').removeClass('selected');
  $$$radio.closest('label').addClass('selected');
});
