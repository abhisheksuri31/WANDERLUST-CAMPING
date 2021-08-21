// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    "use strict";

    //CUSTOMIZING FILE INPUT  BS-CUSTOM-FILE-INPUT
    bsCustomFileInput.init()
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll(".customvalidatemyform");

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms).forEach(function (form) {
      form.addEventListener(
        "submit",
        function (event) {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }

          form.classList.add("was-validated");
        },
        false
      );
    });
  })();