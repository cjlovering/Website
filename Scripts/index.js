//index script
$(document).ready(function(){
  

  var pages = [];

  $.get( 'Scripts/template.html' ).then( function ( template ) {

    var ractive = new Ractive({
      el: '#containerTotal',

      template: template,

      data: { 
        name : 'Charlie Lovering',
        sections : [],
        current_page : 0,
        current_project: 0,
        classes : [],
        jobs: [],
        projects: [],
        cv: {},
        showC : function() {
          var l = projects[current_project].visuals.length;
          return (l > 0);
        }
      }
    });

    var resources = $.getJSON('Messages/resources.json');
    $.when(resources).done(function(r){
      ractive.set('sections', r.sections);
    });

    var info = $.getJSON('Messages/info.json');
    $.when(info).done(function(r){
      ractive.set('jobs', r.jobs);
      ractive.set('classes', r.classes);
      ractive.set('projects', r.projects);
      ractive.set('cv', r.cv);
    });

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

    ractive.on({
      
      showProject: function ( event, which ) {
        ractive.set( 'current_project', null ).then( function () {
          ractive.set( 'current_project', which );
        })
      },
      next: function ( event ) {
          var n = ractive.get("current_project");
          var l = ractive.get('projects').length;
          n += 1;
          if (n == l) {
            n = 0;
          }

          ractive.set( 'current_project', null ).then( function () {
          ractive.set( 'current_project', n );
        })
      },
      prev: function ( event ) {
          var n = ractive.get("current_project");
          n -= 1;
          if (n < 0) {
            var l = ractive.get('projects').length;
            n = l - 1;
          }
          ractive.set( 'current_project', null ).then( function () {
          ractive.set( 'current_project', n );
        })
      }
    });
  });
});