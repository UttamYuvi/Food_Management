$(document).ready(function(res,res){

    $.getJSON("/foods/fillallcategory",function(data){
        
        data.map((item) => {

            $("#category").append(
                $("<option>").text(item.categoryname).val(item.categoryid)
            );
        })
        $('#category').formSelect();
    })

    $('#category').change(function(){

        $.getJSON("/foods/fillallfood", {categoryid:$('#category').val()}, function(data){
        
            $('#food').empty();

            data.map((item) => {
    
                $("#food").append(
                    $("<option>").text(item.foodname).val(item.foodid)
                );
            })
            $('#food').formSelect();
        })  

    })
})