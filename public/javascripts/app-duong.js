let btnNext = document.querySelector(".confirmPhone__btn-next");
let btnNextInvalid = document.querySelector(".confirmPhone__btn-next.invalid");
let formConfirmPhone = document.querySelector(".confirmPhone__signUp");
let codeInput = document.querySelector(".confirmPhone__main-input");
let btnSignUp = document.querySelector(".form-btn-signup");
let overlay = document.querySelector(".menu__overlay");
let btnSignUpHere = document.querySelector(".signUp__click");
let btnForgetpHere = document.querySelector(".forget__click");
let btnForgetpNext = document.querySelector(".form-forgetNumber-btn");
let modalSignUpDisplay = document.querySelector("#exampleModalToggle2");

codeInput.addEventListener("keyup", function () {
  if (codeInput.value.length == 6) {
    btnNextInvalid.classList.remove("invalid");
  } else {
    btnNextInvalid.classList.add("invalid");
  }
});
btnNext.addEventListener("click", function () {
  if (codeInput.value == 888888) {
    Swal.fire({
      icon: "success",
      title: "Bạn đã đăng kí thành công",
      confirmButtonColor: "#198754",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        btnNext.closest(".confirmPhone__signUp").classList.add("hide");
        btnNext.closest(".confirmPhone__signUp").classList.remove("open");
        overlay.classList.remove("open");
        document.body.classList.remove("Scroll");
        codeInput.value = "";
      }
    });
  } else if (codeInput.value !== 888888 && codeInput.value.length == 6) {
    document.querySelector(".alert-error").classList.add("active");
  }
});
btnSignUpHere.addEventListener("click", function () {
  // console.log(document.querySelector("#exampleModalToggle2").style.display);
  if (modalSignUpDisplay.style.display !== "block") {
    modalSignUpDisplay.classList.add("active");
  }
  document.body.classList.add("Scroll");
});

btnForgetpHere.addEventListener("click", function () {
  document.body.classList.add("Scroll");
});

btnForgetpNext.addEventListener("click", function () {
  document.body.classList.remove("Scroll");
});

document
  .querySelector(".btn-close-signUp")
  .addEventListener("click", function () {
    document.querySelector("#exampleModalToggle2").classList.remove("active");
    document.body.classList.remove("Scroll");
  });

document
  .querySelector(".btn-close-forgret")
  .addEventListener("click", function () {
    document.body.classList.remove("Scroll");
  });
