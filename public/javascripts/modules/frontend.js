const $ = require('jquery');
import axios from 'axios';
import dompurify from 'dompurify';




function openModal(e) {
  e.preventDefault();
  $.get(e.currentTarget.action, function(result) {
     $('#' + result.slug).html(result.author);
  });
}

export default openModal;
