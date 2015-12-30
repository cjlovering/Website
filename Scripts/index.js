//index script
$(document).ready(function(){
  

  var pages = [];

  $.get( 'scripts/template.html' ).then( function ( template ) {

    var ractive = new Ractive({
      el: '#containerTotal',

      template: template,

      data: { 
        name : 'Charlie Lovering',
        sections : [],
        current_page : 0,
        classes : [],
        jobs: []
      }
    });

    var resources = $.getJSON('messages/resources.json');
    $.when(resources).done(function(r){
      ractive.set('sections', r.sections);
    });

    var info = $.getJSON('messages/info.json');
    $.when(info).done(function(r){
      ractive.set('jobs', r.jobs);
      ractive.set('classes', r.classes);
    })

    ractive.on( 'toggle', function ( event ) {
      this.toggle( event.keypath + '.expanded' );
    });

    ractive.on({
      show: function ( event, which ) {
        if(which != ractive.get('current_page'))
        ractive.set( 'current_page', null ).then( function () {
          ractive.set( 'current_page', which );
          });

      }});
  });
});