
$('script[type="text/x-jsmart-tmpl"][src]').each(function() {
  var self = this;
  $.ajax({ url: this.src,  success: function(template) { self.innerHTML = template } });
});
