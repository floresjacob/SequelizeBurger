$(document).ready(function() {
    // Getting references to the name input and Burger container, as well as the table body
    var nameInput = $("#Burger-name");
    var BurgerList = $("tbody");
    var BurgerContainer = $(".Burger-container");
    // Adding event listeners to the form to create a new object, and the button to delete
    // an Burger
    $(document).on("submit", "#Burger-form", handleBurgerFormSubmit);
    $(document).on("click", ".delete-Burger", handleDeleteButtonPress);
  
    // Getting the initial list of Burgers
    getBurgers();
  
    // A function to handle what happens when the form is submitted to create a new Burger
    function handleBurgerFormSubmit(event) {
      event.preventDefault();
      // Don't do anything if the name fields hasn't been filled out
      if (!nameInput.val().trim().trim()) {
        return;
      }
      // Calling the upsertBurger function and passing in the value of the name input
      upsertBurger({
        name: nameInput
          .val()
          .trim()
      });
    }
  
    // A function for creating an Burger. Calls getBurgers upon completion
    function upsertBurger(BurgerData) {
      $.post("/api/Burgers", BurgerData)
        .then(getBurgers);
    }
  
    // Function for creating a new list row for Burgers
    function createBurgerRow(BurgerData) {
      var newTr = $("<tr>");
      newTr.data("Burger", BurgerData);
      newTr.append("<td>" + BurgerData.name + "</td>");
    //   newTr.append("<td><a href='/blog?Burger_id=" + BurgerData.id + "'>Go to Posts</a></td>");
    //   newTr.append("<td><a href='/cms?Burger_id=" + BurgerData.id + "'>Create a Post</a></td>");
      newTr.append("<td><a style='cursor:pointer;color:red' class='delete-Burger'>Delete Burger</a></td>");
      return newTr;
    }

    //Function for storing dead burgers
    function storeDeadBurger(BurgerData){
        var newTr = $("<tr>");
        newTr.append("<td>" + BurgerData.name + "</td>");
    }
  
    // Function for retrieving Burgers and getting them ready to be rendered to the page
    function getBurgers() {
      $.get("/api/Burgers", function(data) {
        var rowsToAdd = [];
        for (var i = 0; i < data.length; i++) {
          rowsToAdd.push(createBurgerRow(data[i]));
        }
        renderBurgerList(rowsToAdd);
        nameInput.val("");
      });
    }
  
    // A function for rendering the list of Burgers to the page
    function renderBurgerList(rows) {
      BurgerList.children().not(":last").remove();
      BurgerContainer.children(".alert").remove();
      if (rows.length) {
        console.log(rows);
        BurgerList.prepend(rows);
      }
      else {
        renderEmpty();
      }
    }
  
    // Function for handling what to render when there are no Burgers
    function renderEmpty() {
      var alertDiv = $("<div>");
      alertDiv.addClass("alert alert-danger");
      alertDiv.text("You must create an Burger before you can create a Post.");
      BurgerContainer.append(alertDiv);
    }
  
    // Function for handling what happens when the delete button is pressed
    function handleDeleteButtonPress() {
      var listItemData = $(this).parent("td").parent("tr").data("Burger");
      var id = listItemData.id;
      $.ajax({
        method: "DELETE",
        url: "/api/Burgers/" + id
      })
        .then(getBurgers);
    }
  });
  