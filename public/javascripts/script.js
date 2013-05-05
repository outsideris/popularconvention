// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>

$(document).ready(function() {
  Handlebars.registerHelper('getScore', function(context) {
    var percentage = context[this.key] / context.total * 100;
    return Math.round(percentage * 1000) / 1000
  });

  Handlebars.registerHelper('getCommitCount', function(commits) {
    return (commits + "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  });

  !function(d,s,id){
    var js,fjs=d.getElementsByTagName(s)[0];
    if(!d.getElementById(id)){
      js=d.createElement(s);
      js.id=id;
      js.src="https://platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js,fjs);
    }
  }(document,"script","twitter-wjs");

  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/ko_KR/all.js#xfbml=1";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  (function() {
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/plusone.js';
    console.log('gp')
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
  })();
});
