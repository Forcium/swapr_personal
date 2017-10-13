$(document).ready(function() {

var pathArray = window.location.pathname.split('/');

  $.get("/api/" + pathArray[1] + "/" + pathArray[2], {
    profileID: window.localStorage.getItem("profileID")
  }).then(function(data) {

    var sellerID = data.ProfileId;
    $('.nameText').html(data.item_name);
    $('.darkText').html(data.item_description);
    $('#carousel1').attr('src', data.item_img1);
    $('#carousel2').attr('src', data.item_img2);
    $('#carousel3').attr('src', data.item_img3);

    //populate your items that have been targeted by window item

    if(pathArray[3]){
      $(".buyerBtn").remove();
      $(".buyerBtnSubmit").remove();
    $.get("/transaction/ID/" + pathArray[3]).then(function(response){
      console.log(response);
        if (response.offerAccepted === false) {
          $.get("/api/listing/" + response.SellerItemId).then(function(response2){
            $('#transDecision').html('<div class="card-panel lighten-5 z-depth-1 grey lighten-5">'
            + '<div class="col l10 center">'
            + '<h5>Transaction #110352224925' + response.id
            + '</h5><br /><div class="col s12 m6 l3">'
            + '<img class="responsive-img" src="'
            +  response2.item_img1
            + '"><div class="card-action" id="nameOfCard"><h6 id="nameOfItem">'
            + '</h6></div></div>'
            + '<a class="btn waves-effect waves-light light-green" id="accept" type="submit" name="action">Accept</a>&nbsp;'
            + '<a class="btn waves-effect waves-light orange" id="decline" type="submit"  name="action">Decline</a></div></div>')
          })
        }
        else {
          $.get("/api/listing/" + response.SellerItemId).then(function(response2){
            $('#transDecision').html('<div class="card-panel lighten-5 z-depth-1 grey lighten-5">'
            + '<div class="col l10 center">'
            + '<h5>Transaction #110352224925' + response.id
            + '</h5><br /><div class="col s12 m6 l3">'
            + '<div class="col s12 m6 l3">'
            + '<img class="responsive-img" src="'
            +  response2.item_img1
            + '"><div class="card-action" id="nameOfCard"><h6 id="nameOfItem">'
            + '</h6></div></div>'
            + '<a class="btn waves-effect waves-light orange" id="pendingSwap" type="submit" name="action" href="/communicate/'+response.id+'">Pending Swap!</a></div></div>')
          })

        }

        //accept offers
        $(document).on("click", "#accept", function(event) {
          $.post("/offerAccept", {
            transID: response.id
          }).then(function(response2){
            window.location.href = "/communicate/" + response.id;
          })

        })

        //decline offers
        $(document).on("click", "#decline", function(event) {
          $.post("/offerDecline", {
            transID: response.id
          }).then(function(response2){
            window.location.href = "/profile";
          })

        })
    })
    };



    //flag the other user's item
    $(document).on("click", ".flagBtn", function(event) {
      event.preventDefault();
      var pathArray = window.location.href.split('/');
      var qstring = pathArray[4];

      $.post("/api/flagItem/" + qstring, {
        // flagged: 3,
      }).then(function(data){
        event.preventDefault();
      });
      // swal alert
      swal({
        title: "Are you sure?",
        text: "Only flag listings that are innappropriate or offensive.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          swal("Thank You!", "Your report has been submitted.", {
            icon: "success",
          });
        }
      });
    });

    //unflag the other user's item
    $(document).on("click", ".unFlagBtn", function(event) {
      event.preventDefault();
      var pathArray = window.location.href.split('/');
      var qstring = pathArray[4];

      $.post("/api/unFlagItem/" + qstring, {
        // flagged: 3,
      }).then(function(data){
        event.preventDefault();
      });
      alert("You have unflagged this item.");

    });

    //edit item
    $(document).on("click", "#editListing", function(event) {
      var pathArray = window.location.href.split('/');
      var qstring = pathArray[4];
      $("#hdnId").attr("value", qstring);

    });

    //delete item
    $(document).on("click", "#deleteItem", function(event){
      event.preventDefault();
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this listing!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {

          var qstring = pathArray[4];
          $.post("/api/deleteItem/" + qstring, {
            profileID: window.localStorage.getItem("profileID"),
          }).then(function(data){
            window.location.href = "/profile";
          });
          swal("success! Your listing has been deleted!", {
            icon: "success",
          });
        } else {
          swal("Your listing is safe!");
        }
      });
    });


      //if yours of item  is you
      if (data.ProfileId === parseInt(window.localStorage.getItem("profileID"))) {
        $(".buyerBtn").remove();
        $(".buyerBtnSubmit").remove();
      }

      //if others
      else {

        $(".sellerBtn").remove();
        $('select').material_select('destroy');

        $.post("/api/allListings", {
          profileID: window.localStorage.getItem("profileID")
        }).then(function(data) {
          for (var i = 0; i < data.length; i++) {
            $("#selectDropdown").append(
              $("<option></option>")
              .prop("value", data[i].id)
              .text(data[i].item_name)
              .attr("data-icon", data[i].item_img1)
              .attr('class', 'circle left')
            );
            //intialize
            $('select').material_select();
          }
          $('.swapBtn').on('click', function(event) {
            event.preventDefault();
            var x = $("#selectDropdown").val();
            var pathArray = window.location.pathname.split('/');
            $.post("/api/makeOffer/" + pathArray[2] + "/" + sellerID + "/" + x, {
              profileID: window.localStorage.getItem("profileID")
            }).then(function(data) {
              $('.buyerBtn').empty();
              $('.buyerBtnSubmit').html('<a class="waves-effect waves-light btn pulse orange seeBidBtn center">See your bid</a>');

              $('.seeBidBtn').on("click", function(event) {
                event.preventDefault();
                window.location.href = "/profile/offers";

              });
            });
          });

        });

      }

    });

  $('.carousel').carousel();




  $(".topInputBar").on("keydown", function(event){

    if (event.which == 13){
      var text = $("#search").val();
      event.preventDefault();
      window.location.href="/search/"+text;
    }
  });


});
