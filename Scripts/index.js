//index script
$(document).ready(function(){

  var contains = function(needle) {
    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                var item = this[i];

                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
  };
  var pages = [];

  $.get( 'Scripts/template.html' ).then( function ( template ) {

    var ractive = new Ractive({
      el: '#containerTotal',

      template: template,

      data: {
        name : 'Charlie Lovering',
        cover: true,
        sections : [],
        current_page : 0,
        current_project: 0,
        current_script: 1,
        playlists: [],
        classes : [],
        dispayedClasses: [],
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
      console.log(r.spotify);
      ractive.set('jobs', r.jobs);
      ractive.set('classes', r.classes);
      ractive.set('projects', r.projects);
      ractive.set('cv', r.cv);

      var categories = [];
      for (clss in r.classes) {
        for (cate in r.classes[clss].categories){
            if (!contains.call(categories, r.classes[clss].categories[cate])){
              categories.push(r.classes[clss].categories[cate]);
            }
        }
      }
      ractive.set('dispayedClasses', r.classes);
      ractive.set('categories', categories);
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
     nextSong: function ( event ) {
          var n = ractive.get("current_playlist");
          var l = ractive.get('playlists').length;
          n += 1;
          if (n == l) {
            n = 0;
          }

          ractive.set( 'current_playlist', null ).then( function () {
          ractive.set( 'current_playlist', n );
        })
      },
      downLoad: function ( event ) {
        var n = ractive.get("current_playlist");
       },
      prevSong: function ( event ) {
          var n = ractive.get("current_playlist");
          n -= 1;
          if (n < 0) {
            var l = ractive.get('playlists').length;
            n = l - 1;
          }
          ractive.set( 'current_playlist', null ).then( function () {
          ractive.set( 'current_playlist', n );
        })
      },
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
      },
      toggleFilter: function ( event, index ) {
        var filter = ractive.get('categories')[index];
        console.log(filter);
      }
    });
  });
});
