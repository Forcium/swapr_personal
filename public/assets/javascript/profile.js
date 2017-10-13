$(document).ready(function() {

  //Get number of Listings
  $.post("/api/allListings", {
    profileID: window.localStorage.getItem("profileID")
  }).then(function(data){
    $("#listingsActive").html("Listings Active: " + data.length);
  });

  //Get number of Offers
  $.get("/api/stuffUwant", {
      ProfileId: window.localStorage.getItem("profileID")
  }).then(function(data3){
    var counter = 0;
    try {
      for (var i = 0; i < data3.length; i++) {
        if (typeof data3[i].TransactionsSellerItem[0].Item !== undefined){
          counter++;
        }
      }
    }
    catch (err) {};
    $("#recentOffers").html("Offers Made: " + counter);
  });

  //Get number of Pending swaps
  $.get('/pendingSwaps/',
    {ProfileId: window.localStorage.getItem("profileID")}
  ).then(function(response){
    $('#pendingSwapsHomePage').html("Pending Swaps: " + response.length);
    var BuyerCounter = 0;
    var SellerCounter = 0;
    for (var i = 0; i < response.length; i++) {
      if (parseInt(window.localStorage.getItem("profileID")) === response[i].BuyerProfileId && response[i].BuyerViewed === false) {
        BuyerCounter++;
      }
      else if (parseInt(window.localStorage.getItem("profileID")) === response[i].SellerProfileId && response[i].SellerViewed === false){
        SellerCounter++;
      }
    }
    if (BuyerCounter !== 0 || SellerCounter !== 0) {
      var totalCounter = BuyerCounter + SellerCounter;
    $('#newSwapsTag').html('<span class="new badge lime lighten-1">'+ totalCounter +'</span>');
    }
    else {
    $('#newSwapsTag').empty();
    }
  });

  //main profile
  //Looking for the query string "offers" from url
  var pathArray = window.location.href.split('/');
  var qstring = pathArray[4];

  //If query string "?offers" exists, remove the "?"
  if (pathArray[4]) {
  qstring = qstring.substr(1);
    if (qstring === "offers") {
      $('#stuffUwant').attr("style", "display: static");
      $('#listOfItems').hide();
      $('#changeProfile').hide();
      $('#pendingSwaps').hide();
      $('#profileHome').hide();
      $('.button-collapse').sideNav('hide');
    }
  }

    $('#pendingSwaps').hide();
    $('#listOfItems').hide();
    $('#changeProfile').hide();
    $('#stuffUwant').hide();
    //textera
    $('#textarea1').trigger('autoresize');

    //modals
    $('.modal').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
    });
    $('select').material_select();
    //modals

    // Initialize collapse button
    $(".button-collapse").sideNav();
    // Initialize collapsible (uncomment the line below if you use the dropdown variation)
    $('.collapsible').collapsible();


  $.post("/", {token: window.localStorage.getItem("token")}).then(function(data){
    if (!data){
      window.localStorage.clear();
      window.location.href = "/";
    }
    else {
      //main page welcome header content
      $('#userWelcome').html("Welcome, " + data.username);
      $('#avatarImg').attr("src", data.avatar);
      $('#homePageImg').attr("src", data.avatar);
      $('.name').html(data.username);
      $('.email').html(data.email);
      $('#hdnTkn').attr("value", window.localStorage.getItem("token"));
      $('#hdnId').attr("value", window.localStorage.getItem("profileID"));
      $('#homePageFirstName').html("Hello, " + data.firstName +"!");

      //main page welcome header content
      $('#firstName').attr("placeholder", data.firstName);
      $('#lastName').attr("placeholder", data.lastName);
      $('#email').attr("placeholder", data.email);
      $('#phone').attr("placeholder", data.phone);
      $('#city').attr("placeholder", data.city);
      $('#state').attr("placeholder", data.state);
      $('#username').attr("placeholder", data.username);
      $('#firstName').attr("value", data.firstName);
      $('#lastName').attr("value", data.lastName);
      $('#email').attr("value", data.email);
      $('#phone').attr("value", data.phone);
      $('#city').attr("value", data.city);
      $('#state').attr("value", data.state);
      $('#username').attr("value", data.username);
      $('#firstNameHdn').attr("value", data.firstName);
      $('#lastNameHdn').attr("value", data.lastName);
      $('#emailHdn').attr("value", data.email);
      $('#phoneHdn').attr("value", data.phone);
      $('#cityHdn').attr("value", data.city);
      $('#stateHdn').attr("value", data.state);
      $('#usernameHdn').attr("value", data.username);
      $('#passwordHdn').attr("value", data.pw);
      $('#avatarHdn').attr("value", data.avatar);
    }

      });

//nav bar profile onclick functions=================

  //list of items
  $('#urStuff').on("click", function() {
    $.post("/api/allListings", {
      profileID: window.localStorage.getItem("profileID")
    }).then(function(data){
        $('#listingCards').empty();
        try {
          for (var i = 0; i < data.length; i++) {
            if (typeof data[i].TransactionsSellerItem[0].Transaction !== undefined && data[i].TransactionsSellerItem[0].Transaction.BuyerProfileId !== null && data[i].TransactionsSellerItem[0].Transaction.offerAccepted === false) {
            $('#listingCards').append('<div class="col s12 m6 l3">'
            + '<a href="/listing/'
            +data[i].id
            +'" class="indItemCard" value="'
            +data[i].id
            +'"><div class="col s3 card hoverable" id="imageCard"><div class="card-image"><img id="userPhoto" class="responsive-img" src='
            +data[i].item_img1
            +'><a id="littleGreenBtn" class="btn-floating halfway-fab waves-effect waves-light light-green darken-1 modal-trigger" data-target="modalBids" value="'+ data[i].TransactionsSellerItem[0].Transaction.SellerItemId +'"><i class="material-icons">error</i></a></div><div class="card-action" id="nameOfCard"><h6 id="nameOfItem">'
            +data[i].item_name
            +'</h6></div></div></a></div>');
            }
            else if (typeof data[i].TransactionsSellerItem[0].Transaction !== undefined && data[i].TransactionsSellerItem[0].Transaction.BuyerProfileId !== null && data[i].TransactionsSellerItem[0].Transaction.offerAccepted === true){
              $('#listingCards').append('<div class="col s12 m6 l3">'
              + '<a href="/listing/'
              +data[i].id
              +'" class="indItemCard" value="'
              +data[i].id
              +'"><div class="col s3 card hoverable" id="imageCard"><div class="card-image"><img id="userPhoto" class="responsive-img" src='
              +data[i].item_img1
              +'><a id="littleRedBtn" class="btn-floating halfway-fab waves-effect waves-light red darken-1" value="'+ data[i].TransactionsSellerItem[0].Transaction.SellerItemId +'"><i class="material-icons">check</i></a></div><div class="card-action" id="nameOfCard"><h6 id="nameOfItem">'
              +data[i].item_name
              +'</h6></div></div></a></div>');
            }
            else {
              $('#listingCards').append('<div class="col s12 m6 l3">'
              + '<a href="/listing/'
              +data[i].id
              +'" class="indItemCard" value="'
              +data[i].id
              +'"><div class="col s3 card hoverable" id="imageCard"><div class="card-image"><img id="userPhoto" class="responsive-img" src='
              +data[i].item_img1
              +'></div><div class="card-action" id="nameOfCard"><h6 id="nameOfItem">'
              +data[i].item_name
              +'</h6></div></div></a></div>');
            }
          }
        }
        catch (err) {
        };
    $(document).on("click", '#littleGreenBtn', function(data){
      var transID = $('#littleGreenBtn').attr("value");
      $.get("/transaction/" + transID, {
      }).then(function(response){
        console.log(response);
        $('.offersPopulate').empty();
        var res2;
        for (var i = 0; i < response.length; i++) {
          if (response[i].BuyerProfileId) {

          $('.offersPopulate').append('<div class="card-panel green lighten-5 z-depth-1">'
            +'<div class="row valign-wrapper bidCol">'
            +'<div class="col s8 m8">'
            +'<span class="black-text" id="bidText">'
            +'<h5>You have an offer!</h5>'
            +'</span>'
            +'</div>'
            +'<div class="col s2 m2">'
            +'<a class="waves-effect waves-light light-green btn pulse" href="/listing/'
            + response[i].BuyerItemId
            + '/'
            + response[i].id
            +'">View Item</a>'
            +'</div>'
            +'</div>'
            +'</div>');
          }

          }
      });
    });

    $(document).on("click", '#littleRedBtn', function(data){
      var transID = $('#littleRedBtn').attr("value");
      window.location.href = "/communicate/" + transID;
    });

    $('#listOfItems').show();
    $('#changeProfile').hide();
    $('#pendingSwaps').hide();
    $('#stuffUwant').hide();
    $('#profileHome').hide();
    $('.button-collapse').sideNav('hide');
    });
  });
  //offers made
  $('#offer').on("click", function() {

    $.get("/api/stuffUwant", {
        ProfileId: window.localStorage.getItem("profileID")
    }).then(function(data3){
      $('#offerMadeCards').empty();
      try {
        for (var i = 0; i < data3.length; i++) {
          if (typeof data3[i].TransactionsSellerItem[0].Item !== undefined) {
            $('#offerMadeCards').append('<div class="col s12 m6 l3 center">'
            + '<a href="/listing/'
            +data3[i].TransactionsSellerItem[0].Transaction.SellerItemId
            +'" class="indItemCard" value="'
            +data3[i].TransactionsSellerItem[0].Transaction.SellerItemId
            +'"><div class="col s3 card" id="imageCard"><div class="card-image"><img id="userPhoto" class="responsive-img" src="'
            +data3[i].TransactionsSellerItem[0].Items[0].item_img1
            +'"></div><div class="card-action" id="nameOfCard"><h6 id="nameOfItem">'
            +data3[i].TransactionsSellerItem[0].Items[0].item_name
            +'</h6></div><div class = "overlay"><h5 class = "white-text">Owned by:</h5><h4 class ="white-text">'
            + data3[i].TransactionsSellerItem[0].username
            + '</h4><div>'
            + '<img id="avatarImg" class="text circle" width="50" height="50" src="'
            + data3[i].TransactionsSellerItem[0].avatar
            + '" />&nbsp;</div></div></div></a></div>');
          }
        }
      }
      catch (err) {
      };
    });

    $('#stuffUwant').show();
    $('#listOfItems').hide();
    $('#changeProfile').hide();
    $('#pendingSwaps').hide();
    $('#profileHome').hide();
    $('.button-collapse').sideNav('hide');
  });
  //pending swaps

  $('#pend').on("click", function() {
      var uid = window.localStorage.getItem("profileID");
    $.get('/pendingSwaps/',
      {ProfileId: uid}
    ).then(function(response){

      $("#pendingSwapsContent").empty();
      for (var i = 0; i < response.length; i++) {
        var chatPage = response[i].id
      if (parseInt(uid) === response[i].BuyerProfileId) {

      var Clark = function (chatPage) {
          $.get("/api/listing/" + response[i].BuyerItemId + "/" + response[i].SellerItemId).then(function(data){
        $("#pendingSwapsContent").append('<div class="card-panel hoverable z-depth-3" id="pendStuff"><div class="row valign-wrapper"><div class="col s4 m2"><img src="'+ data[0].item_img1 +'" id="pendingThemImg" class="responsive-img valign"></div><div class="col s4 m8"><center><a class="waves-effect waves-green btn-flat" href="/communicate/' + chatPage +'">Check the status of your Swap</a></center></div><div class="col s4 m2"><img src="'+ data[1].item_img1 +'" id="pendingYouImg" class="responsive-img valign"></div></div></div>');
        })
        $.post('/updateViewed/buyer',
          {ProfileId: uid}
          );
      };
      Clark(chatPage);
      }
      else if (parseInt(uid) === response[i].SellerProfileId) {
        var Clark = function (chatPage) {
          $.get("/api/listing/" + response[i].SellerItemId + "/" + response[i].BuyerItemId).then(function(data){
        $("#pendingSwapsContent").append('<div class="card-panel hoverable z-depth-3" id="pendStuff"><div class="row valign-wrapper"><div class="col s4 m2"><img src="'+ data[0].item_img1 +'" id="pendingThemImg" class="responsive-img valign"></div><div class="col s4 m8"><center><a class="waves-effect waves-green btn-flat" href="/communicate/' + chatPage +'">Check the status of your Swap</a></center></div><div class="col s4 m2"><img src="'+ data[1].item_img1 +'" id="pendingYouImg" class="responsive-img valign"></div></div></div>');
        })
        $.post('/updateViewed/seller',
          {ProfileId: uid}
          );
      };
      Clark(chatPage);
      }
    }
    })

    $('#listOfItems').hide();
    $('#changeProfile').hide();
    $('#stuffUwant').hide();
    $('#profileHome').hide();
    $('#pendingSwaps').show();
    $('.button-collapse').sideNav('hide');



  });
  //update profile
  $('.update').on("click", function() {
    $('#changeProfile').show();
    $('#pendingSwaps').hide();
    $('#listOfItems').hide();
    $('#stuffUwant').hide();
    $('#profileHome').hide();
    $('.button-collapse').sideNav('hide');



      var options = {
        beforeSubmit: showRequest, // pre-submit callback
        success: showResponse // post-submit callback
      };

      // bind to the form's submit event
      $(document).on("submit", "#frmUploader", function(event) {
        $(this).ajaxSubmit(options);
        // always return false to prevent standard browser submit and page navigation
        return false;
      });

      $(document).on("submit", "#addListing", function(event) {

        $(this).ajaxSubmit(options);
        // always return false to prevent standard browser submit and page navigation
        return false;
      });
    });

    // pre-submit callback
    function showRequest(formData, jqForm, options) {
      alert('Uploading is starting.');
      return true;
    }

    // post-submit callback
    function showResponse(responseText, statusText, xhr, $form) {
      alert('status: ' + statusText + '\n\nresponseText: \n' + responseText);
    }

    //delete account button
    $(document).on("click", "#deleteAcct", function(event){
      event.preventDefault();
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover your account information!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          $.post("/api/deleteAcct", {
            profileID: window.localStorage.getItem("profileID"),
            token: window.localStorage.getItem("token")
          }).then(function(data){
            window.localStorage.clear();
            window.location.href = "/";
          });
          swal("Poof! Your account has been deleted!", {
            icon: "success",
          });
        } else {
          swal("Your account is safe!");
        }
      });
    });

    //logout
    $(document).on("click", "#exit", function(event) {
      window.localStorage.clear();
      window.location.href = "/";
    });




    //~~~~~~~~~~~~~~~~~~navbar search function

    $(".topInputBar").on("keydown", function(event){

      if (event.which == 13){
        var text = $("#search").val();
        event.preventDefault();
        window.location.href="/search/"+text;
      }
    });


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



}); //doc ready
