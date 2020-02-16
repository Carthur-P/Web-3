//ready function ensures that the javescript doesnt run until the DOM is ready
$(function () {
    var $content = $('#content');
    var $footer = $('footer');
    var $header = $('#header');
    var $subheader = $('#subheader');

    $content.hide();
    $footer.hide();
    $('nav').hide().slideDown(1000, function () {
        $content.slideDown(1000, function () {
            $footer.fadeIn(400);
        });
    });

    $subheader.css("opacity", "0");
    $header.css("opacity", "0").animate({ opacity: "1" }, 1300, function () {
        $subheader.animate({ opacity: "1" }, 1300);
    });

    $("#slider").on("input", function(){
        $("#yearLabel").text("Year: " + $("#slider").val());
    });

    //AJAX
    $('#button').on('click', function () {
        $.ajax({
            url: url,
            data: {
                'name': "New Country",
                'data': dict = {}
            },
            method: 'POST',
            success: function (response) {
                console.log("Country added succesfully");
                var $response = JSON.parse(response);
                for (country in $response) {
                    console.log($response[country].name);
                }
            }
        }).fail(function () {
            console.log("Country was not added");
        });
    });

    /*$.ajax({
        url: url,
        data: {country: "New Country"},
        method: 'DELETE',
        success: function(response){
            console.log("Country deleted succesfully");
            var $response = JSON.parse(response);
            for (country in $response) {
                console.log($response[country].name);
            }
        }
    }).fail(function(){
        console.log("Country was not deleted");
    });*/

    /*$.ajax({
        url: url,
        data: {
            country: "Thailand",
            newCountry: "Newer Country"
        },
        method: 'PUT',
        success: function(response){
            console.log("Country updated succesfully");
            var $response = JSON.parse(response);
            for (country in $response) {
                console.log($response[country].name);
            }
        }
    }).fail(function(){
        console.log("Country was not updated");
    });*/
});