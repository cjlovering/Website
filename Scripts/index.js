//index script
$(document).ready(function(){
  $.get( 'scripts/template.html' ).then( function ( template ) {

    var ractive = new Ractive({
      el: '#containerTotal',

      template: template,

      data: { 
        name: 'Charlie Lovering',
        sections: []
      }
    });

    var resources = $.getJSON('messages/resources.json');
    $.when(resources).done(function(r){
      ractive.set('sections', r.sections);
    });
  });
});