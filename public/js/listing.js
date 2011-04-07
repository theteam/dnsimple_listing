var listing = {};

//giddy up.
$(document).ready(function() {
    listing.eventListeners();
});


listing.eventListeners = function() {
    
    $('a.edit').click(function(e){
       var row = $(this).parents("tr");
       listing.editRow(row);
    });
    
};

listing.editRow = function(row) {
    
    
    
};