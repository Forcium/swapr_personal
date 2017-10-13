$(document).ready(function() {

var roomID;

$.post("/", {
  token: window.localStorage.getItem("token")
}).then(function(data) {

  if (!data) {

    window.localStorage.clear();
    window.location.href = "/";

  } else {
    var pathArray = window.location.href.split('/');
    var uid = window.localStorage.getItem("profileID");
    $.post("/communicate/" + pathArray[4], {
      userID: uid
    }).then(function(dbReponse){
      var transId = "Transaction #110352224925" + dbReponse.id;
      roomID = "110352224925" + dbReponse.id;
      $("#transNumber").html(transId);

      var yourID;
      var yourItem;
      var otherID;
      var otherItem;

      if (parseInt(uid) === dbReponse.BuyerProfileId) {

        yourID = dbReponse.BuyerProfileId;
        yourItem = dbReponse.BuyerItemId;
        otherID = dbReponse.SellerProfileId;
        otherItem = dbReponse.SellerItemId;
      }
      else if (parseInt(uid) === dbReponse.SellerProfileId){

        yourID = dbReponse.SellerProfileId;
        yourItem = dbReponse.SellerItemId;
        otherID = dbReponse.BuyerProfileId;
        otherItem = dbReponse.BuyerItemId;
      }

      $.get("/communicate/yourItem/" + yourItem, function(response){
        $('#yourItemC').attr("src",response.item_img1);
        $('#yourItem').html(response.item_description);
      });
      $.get("/communicate/otherItem/" + otherItem, function(response2){
        $('#otherItemC').attr("src",response2.item_img1);
        $('#otherItem').html(response2.item_description);
      });

    var config = {
      apiKey: "AIzaSyAvfQNHxo8df0lNiPlMWFgu95tBl8rd8Eg",
      authDomain: "class-test-829c1.firebaseapp.com",
      databaseURL: "https://class-test-829c1.firebaseio.com",
      projectId: "class-test-829c1",
      storageBucket: "class-test-829c1.appspot.com",
      messagingSenderId: "38207736538"
    };

    firebase.initializeApp(config);

    var userData = firebase.database();
    var postId;
        $("#add-msg-btn").on("click", function() {
          var user = data.avatar;
          var messages = $("#message-input").val().trim();

          var newMsg = {
                name: user,
                message: messages
          };

          var newPostRef = userData.ref().child(roomID).push(newMsg);
          postId = newPostRef.key;

          $("#message-input").val("");
          return false;

        });

      userData.ref(roomID).on("child_added", function(childSnapshot, prevChildKey) {
        var route2 = childSnapshot.val();
        $("#msg-table > tbody").append("<tr><td><img id='avatarImg' class='circle' src='" +
        route2.name + "'></td><td><div class='chatMessage'>" + route2.message + "</div></td></tr>");
        updateScroll();

      });
    });
  }
});


  function updateScroll(){
      var element = document.getElementById("Convos");
      element.scrollTop = element.scrollHeight;
  }

});
