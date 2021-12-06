document.getElementById("upload").onclick = function() {};

const btnUpload = document.getElementById("upload");
const btnAddQues = document.getElementById("addQuestion");
const btnSentence = document.getElementById("addSentence");
const valueUpInput = document.getElementById("uploadEditor");
const quesItem = document.querySelector(".main__question-list");
const quesList = document.querySelectorAll(".main__question-list");
const answerList = document.querySelectorAll(".main__form-input");
let btnRemoveQues = document.querySelectorAll(".main__question-close");
let btnAddAnswer = document.querySelectorAll(".main__question-body-btn");
let btnRemoveAnswer = document.querySelectorAll(
    ".modal__form-btn-remove-answer"
);
let bodyList = document.querySelectorAll(".main__question-body");
let headerClick = document.querySelectorAll(".main__question-header");
let navHeader = document.querySelectorAll(".main__question-indicator");
let countAnswer = 0;
let count = 0;
let liLength;

// Lắng nghe Btn UpLoad
btnUpload.addEventListener("click", () => {
    const strInput = valueUpInput.value;
    //   console.log(strInput);
    let arrayQues = strInput.split("Câu");
    arrayQues.shift();
    //   console.log(arrayQues);
    for (let i = 0; i < arrayQues.length; i++) {
        let subText = arrayQues[i].split("A.");
        let arr = ["B.", "C.", "D.", "E.", "F.", "G.", "H."];
        const strQues = subText[0].trim();
        let valueQuestion;
        let arrayAnswer = [];

        if (strQues.indexOf(".") >= 0 && arrayQues[i].indexOf("A.") >= 0) {
            valueQuestion = strQues.split(".")[1].trim();
        } else if (strQues.indexOf(":") >= 0 && arrayQues[i].indexOf("A.") >= 0) {
            valueQuestion = strQues.split(":")[1].trim();
        } else {
            return swal({
                type: "error",
                title: "Đã có lỗi...",
                text: "Nội dung nhập không đúng vui lòng thử lại!",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Đồng ý",
            });
        }

        swal({
            title: "",
            text: "Nhập đề thành công." +
                "\n" +
                "Vui lòng kiểm tra lại đề và thêm đáp án",
            type: "success",
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Đồng ý",
        });

        for (let i = 0; i < arr.length; i++) {
            if (subText.length > 1) {
                subText = subText[1].split(arr[i]);
                arrayAnswer.push(subText[0].trim());
            }
        }
        // console.log(valueQuestion);
        // console.log(arrayAnswer);
        handleUpLoad(valueQuestion, arrayAnswer);
        handleRemove();
        handleRemoveAnswer();
        valueUpInput.value = "";
    }

    return;
});

// Lắng nghe Btn Add Question
btnAddQues.addEventListener("click", function() {
    handleCreateQuestion();
    handleRemove();
});

btnSentence.addEventListener("click", function() {
    handleCreateSentence();
    handleRemove();
});

function handleRemoveAnswer() {
    for (let i = 0; i < btnRemoveAnswer.length; i++) {
        let clone = btnRemoveAnswer[i].cloneNode(true);
        btnRemoveAnswer[i].replaceWith(clone);
    }
    btnRemoveAnswer = document.querySelectorAll(".modal__form-btn-remove-answer");

    for (let i = 0; i < btnRemoveAnswer.length; i++) {
        btnRemoveAnswer[i].addEventListener("click", function() {
            GetParent(i, btnRemoveAnswer[i], ".main__form-item").remove();
        });
    }
}

function handleRemove() {
    for (let i = 0; i < btnRemoveQues.length; i++) {
        let clone = btnRemoveQues[i].cloneNode(true);
        btnRemoveQues[i].replaceWith(clone);
    }
    //btnRemoveQues = document.querySelectorAll(".modal__form-btn-remove");
    btnRemoveQues = document.querySelectorAll(".modal__form-btn-remove");
    //console.log(btnRemoveQues.length)
    for (let i = 0; i < btnRemoveQues.length; i++) {
        // console.log(i);

        //btnRemoveQues[i] = btnRemoveQues[i].cloneNode(true);
        btnRemoveQues[i].addEventListener("click", function() {
            //   console.log(i);
            GetParent(i, btnRemoveQues[i], ".main__question-item").remove();
        });
    }
}

// get The Parent Element
function GetParent(index, element, selector) {
    //console.log(index)
    while (element.parentElement) {
        // Kiểm tra element có thẻ cha như yêu cầu k
        if (element.parentElement.matches(selector)) {
            return element.parentElement;
        }
        element = element.parentElement;
    }
}

// Handle click Header Question
function HandleHeaderClick() {
    // break khỏi vòng loop
    for (let i = 0; i < headerClick.length; i++) {
        let clone = headerClick[i].cloneNode(true);
        headerClick[i].replaceWith(clone);
    }

    headerClick = document.querySelectorAll(".main__question-header");
    for (let i = 0; i < headerClick.length; i++) {
        headerClick[i].addEventListener("click", function() {
            bodyList = document.querySelectorAll(".main__question-body");
            navHeader = document.querySelectorAll(".main__question-indicator");

            //   lấy element parent
            let handleHeader = headerClick[i]
                .closest(".main__question-item")
                .querySelector(".main__question-body");

            bodyList.forEach((bodyItem) => {
                bodyItem.classList.remove("active");
            });

            handleHeader.classList.add("active");

            navHeader.forEach((navItem) => {
                navItem.classList.remove("active");
            });
            headerClick[i]
                .querySelector(".main__question-indicator")
                .classList.add("active");
        });
    }
}

function handleUpLoad(valueQuestion, arrayAnswer) {
    let renderLi = ``;
    count += 1;
    //   console.log(count);
    //   get number Question
    for (let i = 0; i < arrayAnswer.length; i++) {

        let checker
        if (i == 0) {
            checker = 'checked=checked'
        }

        countAnswer += 1
        renderLi += `<li class="main__form-item row gx-4">
          <div class="col-md-1">
              <div class="main__form-checkbox">
                <label class="main__form-checkbox-input">
                    <input class="main__form-checkbox-radio" type="radio" name="radio${count}" ${checker}>
                    <span></span>
                </label>
              </div>
          </div>
          <div class="col-md-10">
              <input type="text" class="form-control main__form-input"
                  placeholder="Nội dung câu trả lời" value="${arrayAnswer[i]}">
          </div>
          <div class="col-md-1">
              <button class="btn btn-danger main__form-btn"
                  data-bs-target="#removeAnswerUl${countAnswer}" data-bs-toggle="modal">
                  <i class="fas fa-trash"></i>
              </button>
  
              <div class="modal modal__form show" id="removeAnswerUl${countAnswer}"
              tabindex="-1" aria-labelledby="removeAnswerUl${countAnswer}"
              aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content modal__form-content">
                      <div class="main__modal-body">
                          <svg xmlns="http://www.w3.org/2000/svg"
                              fill="none" height="120" viewBox="0 0 27 27"
                              width="120">
                              <path
                                  d="M4.6 25.925H22.5C25.2 25.925 26.8 23.022 25.6 20.6195L16.6 3.80194C15.3 1.29934 11.8 1.29934 10.5 3.80194L1.5 20.6195C0.299997 23.022 1.9 25.925 4.6 25.925Z"
                                  stroke="#facea8" stroke-linecap="round"
                                  stroke-miterlimit="10"
                                  stroke-width="2" />
                              <path
                                  d="M13.9 18.0168H13.2C12.5 18.0168 12.6 17.4162 12.6 16.7154L11.9 9.30769C11.9 8.60696 12.5 8.00635 13.2 8.00635H13.9C14.6 8.00635 15.2 8.60696 15.2 9.30769L14.5 16.7154C14.5 17.4162 14.6 18.0168 13.9 18.0168Z"
                                  fill="#facea8" />
                              <path
                                  d="M13.5 21.9208C14.4389 21.9208 15.2 21.3382 15.2 20.6195C15.2 19.9008 14.4389 19.3181 13.5 19.3181C12.5611 19.3181 11.8 19.9008 11.8 20.6195C11.8 21.3382 12.5611 21.9208 13.5 21.9208Z"
                                  fill="#facea8" />
                          </svg>
                          <span class="modal__form-text">
                              Bạn có chắc muốn xóa câu trả lời này?
                          </span>
                      </div>
  
  
                      <div class="modal__form-btn">
                          <button type="button"
                              class="btn btn-danger modal__form-btn-remove-answer" data-bs-dismiss="modal">Xóa</button>
  
                          <button class="btn btn-secondary"
                              data-bs-dismiss="modal">Bỏ qua</button>
                      </div>
                  </div>
              </div>
          </div>
  
          </div>
      </li>`;
    }

    let renderQuestion = `<li class="main__question-item">
    <div class="main__question-header">
       <div class="main__question-title">
           <h3 class="main__question-name">
               ${valueQuestion}
           </h3>
       </div>
       <div class="main__question-direction">
           <!-- Btn Remove Question -->
           <a href="" class="btn btn-danger main__question-close"
               data-bs-target="#closeAnswe${count}" data-bs-toggle="modal">
               <i class="fas fa-times"></i>
           </a>
  
           <div class="modal modal__form show" id="closeAnswe${count}" tabindex="-1"
                  aria-labelledby="closeAnswe${count}" aria-hidden="true">
                  <div class="modal-dialog modal-dialog-centered">
                      <div class="modal-content modal__form-content">
                          <div class="main__modal-body">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                  height="120" viewBox="0 0 27 27" width="120">
                                  <path
                                      d="M4.6 25.925H22.5C25.2 25.925 26.8 23.022 25.6 20.6195L16.6 3.80194C15.3 1.29934 11.8 1.29934 10.5 3.80194L1.5 20.6195C0.299997 23.022 1.9 25.925 4.6 25.925Z"
                                      stroke="#facea8" stroke-linecap="round"
                                      stroke-miterlimit="10" stroke-width="2" />
                                  <path
                                      d="M13.9 18.0168H13.2C12.5 18.0168 12.6 17.4162 12.6 16.7154L11.9 9.30769C11.9 8.60696 12.5 8.00635 13.2 8.00635H13.9C14.6 8.00635 15.2 8.60696 15.2 9.30769L14.5 16.7154C14.5 17.4162 14.6 18.0168 13.9 18.0168Z"
                                      fill="#facea8" />
                                  <path
                                      d="M13.5 21.9208C14.4389 21.9208 15.2 21.3382 15.2 20.6195C15.2 19.9008 14.4389 19.3181 13.5 19.3181C12.5611 19.3181 11.8 19.9008 11.8 20.6195C11.8 21.3382 12.5611 21.9208 13.5 21.9208Z"
                                      fill="#facea8" />
                              </svg>
                              <span class="modal__form-text">
                                  Bạn có chắc muốn xóa câu hỏi này?
                              </span>
                          </div>
  
  
                          <div class="modal__form-btn">
                              <button type="button" data-bs-dismiss="modal"
                                  class="btn btn-danger modal__form-btn-remove">Xóa</button>
                              <button class="btn btn-secondary" data-bs-dismiss="modal">Bỏ
                                  qua</button>
                          </div>
                      </div>
                  </div>
              </div>
           
  
           <!-- Tab Question -->
           <span class="main__question-indicator">
               <i class="fas fa-chevron-up"></i>
           </span>
       </div>
   </div>
   <div class="main__question-body">
       <!-- Input Content Question -->
       <div class="row">
           <div class="col-md-12">
               <div class="form-floating main__question-input-content">
                   <textarea class="form-control" placeholder="Leave a comment here"
                       id="floatingTextarea" style="height: 100px;">${valueQuestion}
                       </textarea>
                   <label for="floatingTextarea">Nội dung câu hỏi</label>
               </div>
           </div>
       </div>
  
       <!-- Input Content Answer -->
       <div class="main__question-form">
           <h3 class="main__form-heading">Câu trả lời</h3>
           <ul class="main__form-list">${renderLi}</ul>
           </div>

           <div>
                <b>Thêm ảnh:</b>
                <div class="container-images">
                    <input autocomplete="off" type="file" name="avatar" accept="image/*" multiple>
                </div>
            </div>

           <!-- Btn add Answer -->
           <button class="btn btn-danger main__question-body-btn">
               <i class="fas fa-plus main__exam-question-btn-add"></i>
               Thêm câu trả lời
           </button>
  
           </div>
       </li>`;
    //   return (quesItem.innerHTML += renderQuestion);

    $(".main__question-list").append(renderQuestion);

    $('input[name="avatar"]').imageuploadify();
    $("input").attr("autocomplete", "off");

    let container = $('.main__question-list');

    container.find("li").each(function(index, element) {
        $(element).find('.main__question-body').each(function(index, element) {
            $(element).find('div').each(function(index, element) {
                $(element).find('.container-images').each(function(index, element) {
                    let colSize = $(element).find('.imageuploadify').length
                    $(element).find('.imageuploadify').each(function(index, element) {
                        if (colSize > 0 && index < colSize - 1) {
                            $(element).remove()
                        }
                    });
                });
            });
        });
    });

    for (let i = 0; i < btnAddAnswer.length; i++) {
        let clone = btnAddAnswer[i].cloneNode(true);
        btnAddAnswer[i].replaceWith(clone);
    }
    // Handle Add Question When Upload
    btnAddAnswer = document.querySelectorAll(".main__question-body-btn");
    // Btn add Answer
    for (let i = 0; i < btnAddAnswer.length; i++) {
        btnAddAnswer[i].addEventListener("click", function() {
            liLength = GetParent(
                i,
                btnAddAnswer[i],
                ".main__question-body"
            ).querySelectorAll(".main__form-item");

            if (liLength.length > 0) {
                count = GetParent(i, btnAddAnswer[i], ".main__question-body")
                    .querySelector(".main__form-checkbox-radio")
                    .name.replace(/[^0-9]/g, "");
            }

            console.log(count);
            countAnswer += 1;
            //   console.log(countAnswer);
            let answerItem = `<li class="main__form-item row gx-4">
                  <div class="col-md-1">
                      <div class="main__form-checkbox">
                          <label class="main__form-checkbox-input">
                              <input type="radio" name="radio${count}">
                              <span></span>
                          </label>
                      </div>
                  </div>
                  <div class="col-md-10">
                      <input type="text" class="form-control main__form-input"
                          placeholder="Nội dung câu trả lời">
                  </div>
                  <div class="col-md-1">
                      <button class="btn btn-danger main__form-btn"
                          data-bs-target="#removeAnswerAl${countAnswer}" data-bs-toggle="modal">
                          <i class="fas fa-trash"></i>
                      </button>
  
                      <div class="modal modal__form show" id="removeAnswerAl${countAnswer}"
                          tabindex="-1" aria-labelledby="removeAnswerAl${countAnswer}"
                          aria-hidden="true">
                          <div class="modal-dialog modal-dialog-centered">
                              <div class="modal-content modal__form-content">
                                  <div class="main__modal-body">
                                      <svg xmlns="http://www.w3.org/2000/svg"
                                          fill="none" height="120" viewBox="0 0 27 27"
                                          width="120">
                                          <path
                                              d="M4.6 25.925H22.5C25.2 25.925 26.8 23.022 25.6 20.6195L16.6 3.80194C15.3 1.29934 11.8 1.29934 10.5 3.80194L1.5 20.6195C0.299997 23.022 1.9 25.925 4.6 25.925Z"
                                              stroke="#facea8" stroke-linecap="round"
                                              stroke-miterlimit="10"
                                              stroke-width="2" />
                                          <path
                                              d="M13.9 18.0168H13.2C12.5 18.0168 12.6 17.4162 12.6 16.7154L11.9 9.30769C11.9 8.60696 12.5 8.00635 13.2 8.00635H13.9C14.6 8.00635 15.2 8.60696 15.2 9.30769L14.5 16.7154C14.5 17.4162 14.6 18.0168 13.9 18.0168Z"
                                              fill="#facea8" />
                                          <path
                                              d="M13.5 21.9208C14.4389 21.9208 15.2 21.3382 15.2 20.6195C15.2 19.9008 14.4389 19.3181 13.5 19.3181C12.5611 19.3181 11.8 19.9008 11.8 20.6195C11.8 21.3382 12.5611 21.9208 13.5 21.9208Z"
                                              fill="#facea8" />
                                      </svg>
                                      <span class="modal__form-text">
                                          Bạn có chắc muốn xóa câu trả lời này?
                                      </span>
                                  </div>
  
                                  <div class="modal__form-btn">
                                      <button type="button"
                                          class="btn btn-danger modal__form-btn-remove-answer" data-bs-dismiss="modal">Xóa</button>
  
                                      <button class="btn btn-secondary"
                                          data-bs-dismiss="modal">Bỏ qua</button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </li>`;

            btnAddAnswer[i]
                .closest(".main__question-body")
                .querySelector(".main__form-list")
                .insertAdjacentHTML("beforeend", answerItem);

            handleRemoveAnswer();
        });
    }

    // handleAddAnswer(count, countAnswer);
    countAnswer = countAnswer;
    count = count;

    HandleHeaderClick();
}

// Handle Create Question
function handleCreateQuestion() {
    navHeader = document.querySelectorAll(".main__question-indicator");
    bodyList = document.querySelectorAll(".main__question-body");
    count += 1;
    countAnswer += 1;

    bodyList.forEach((bodyItem) => {
        bodyItem.classList.remove("active");
    });
    navHeader.forEach((navItem) => {
        navItem.classList.remove("active");
    });

    let formEmpty = `<li class="main__question-item">
    <!-- Question header -->
    <div class="main__question-header">
        <div class="main__question-title">
            <h3 class="main__question-name">
                Chưa có nội dung câu hỏi
            </h3>
        </div>
        <div class="main__question-direction">
            <!-- Btn Remove Question -->
            <a href="" class="btn btn-danger main__question-close"
                data-bs-target="#closeQues${count}" data-bs-toggle="modal">
                <i class="fas fa-times"></i>
            </a>

            <div class="modal modal__form show" id="closeQues${count}" tabindex="-1"
                aria-labelledby="closeQues${count}" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content modal__form-content">
                        <div class="main__modal-body">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                height="120" viewBox="0 0 27 27" width="120">
                                <path
                                    d="M4.6 25.925H22.5C25.2 25.925 26.8 23.022 25.6 20.6195L16.6 3.80194C15.3 1.29934 11.8 1.29934 10.5 3.80194L1.5 20.6195C0.299997 23.022 1.9 25.925 4.6 25.925Z"
                                    stroke="#facea8" stroke-linecap="round"
                                    stroke-miterlimit="10" stroke-width="2" />
                                <path
                                    d="M13.9 18.0168H13.2C12.5 18.0168 12.6 17.4162 12.6 16.7154L11.9 9.30769C11.9 8.60696 12.5 8.00635 13.2 8.00635H13.9C14.6 8.00635 15.2 8.60696 15.2 9.30769L14.5 16.7154C14.5 17.4162 14.6 18.0168 13.9 18.0168Z"
                                    fill="#facea8" />
                                <path
                                    d="M13.5 21.9208C14.4389 21.9208 15.2 21.3382 15.2 20.6195C15.2 19.9008 14.4389 19.3181 13.5 19.3181C12.5611 19.3181 11.8 19.9008 11.8 20.6195C11.8 21.3382 12.5611 21.9208 13.5 21.9208Z"
                                    fill="#facea8" />
                            </svg>
                            <span class="modal__form-text">
                                Bạn có chắc muốn xóa câu hỏi này?
                            </span>
                        </div>


                        <div class="modal__form-btn">
                            <button type="button" data-bs-dismiss="modal"
                                class="btn btn-danger modal__form-btn-remove">Xóa</button>
                            <button class="btn btn-secondary" data-bs-dismiss="modal">Bỏ
                                qua</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab Question -->
            <span class="main__question-indicator active">
                <i class="fas fa-chevron-up"></i>
            </span>
        </div>
    </div>
  
    <!-- Question body -->
    <div class="main__question-body active">
        <!-- Input Content Question -->
        <div class="row">
            <div class="col-md-12">
                <div class="form-floating main__question-input-content">
                    <textarea class="form-control" name="contentQuestion" placeholder="Leave a comment here"
                        id="floatingTextarea" style="height: 100px;"></textarea>
                    <label for="floatingTextarea">Nội dung câu hỏi</label>
                </div>
            </div>
        </div>
  
        <!-- Input Content Answer -->
        <div class="main__question-form">
            <h3 class="main__form-heading">Câu trả lời</h3>
            <ul class="main__form-list">
                <li class="main__form-item row gx-4">
                    <div class="col-md-1">
                        <div class="main__form-checkbox">
                          <label class="main__form-checkbox-input">
                              <input class="main__form-checkbox-radio" type="radio" name="radio${count}" checked="checked">
                              <span></span>
                          </label>
                        </div>
                    </div>
                    <div class="col-md-10">
                        <input type="text" name="Answer" class="form-control main__form-input"
                            placeholder="Nội dung câu trả lời">
                    </div>
                    <div class="col-md-1">
                        <button class="btn btn-danger main__form-btn"
                            data-bs-target="#removeAnswerA${countAnswer}" data-bs-toggle="modal">
                            <i class="fas fa-trash"></i>
                        </button>

                        <div class="modal modal__form show" id="removeAnswerA${countAnswer}"
                            tabindex="-1" aria-labelledby="removeAnswerA${countAnswer}"
                            aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content modal__form-content">
                                    <div class="main__modal-body">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            fill="none" height="120" viewBox="0 0 27 27"
                                            width="120">
                                            <path
                                                d="M4.6 25.925H22.5C25.2 25.925 26.8 23.022 25.6 20.6195L16.6 3.80194C15.3 1.29934 11.8 1.29934 10.5 3.80194L1.5 20.6195C0.299997 23.022 1.9 25.925 4.6 25.925Z"
                                                stroke="#facea8" stroke-linecap="round"
                                                stroke-miterlimit="10"
                                                stroke-width="2" />
                                            <path
                                                d="M13.9 18.0168H13.2C12.5 18.0168 12.6 17.4162 12.6 16.7154L11.9 9.30769C11.9 8.60696 12.5 8.00635 13.2 8.00635H13.9C14.6 8.00635 15.2 8.60696 15.2 9.30769L14.5 16.7154C14.5 17.4162 14.6 18.0168 13.9 18.0168Z"
                                                fill="#facea8" />
                                            <path
                                                d="M13.5 21.9208C14.4389 21.9208 15.2 21.3382 15.2 20.6195C15.2 19.9008 14.4389 19.3181 13.5 19.3181C12.5611 19.3181 11.8 19.9008 11.8 20.6195C11.8 21.3382 12.5611 21.9208 13.5 21.9208Z"
                                                fill="#facea8" />
                                        </svg>
                                        <span class="modal__form-text">
                                            Bạn có chắc muốn xóa câu trả lời này?
                                        </span>
                                    </div>


                                    <div class="modal__form-btn">
                                        <button type="button"
                                            class="btn btn-danger modal__form-btn-remove-answer" data-bs-dismiss="modal">Xóa</button>

                                        <button class="btn btn-secondary"
                                            data-bs-dismiss="modal">Bỏ qua</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
  
                <li class="main__form-item row gx-4">
                    <div class="col-md-1">
                        <div class="main__form-checkbox">
                          <label class="main__form-checkbox-input">
                              <input class="main__form-checkbox-radio" type="radio" name="radio${count}">
                              <span></span>
                          </label>
                        </div>
                    </div>
                    <div class="col-md-10">
                        <input type="text" name="Answer" class="form-control main__form-input"
                            placeholder="Nội dung câu trả lời">
                    </div>
                    <div class="col-md-1">
                        <button class="btn btn-danger main__form-btn"
                            data-bs-target="#removeAnswerB${countAnswer}" data-bs-toggle="modal">
                            <i class="fas fa-trash"></i>
                        </button>

                        <div class="modal modal__form show" id="removeAnswerB${countAnswer}"
                            tabindex="-1" aria-labelledby="removeAnswerB${countAnswer}"
                            aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content modal__form-content">
                                    <div class="main__modal-body">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            fill="none" height="120" viewBox="0 0 27 27"
                                            width="120">
                                            <path
                                                d="M4.6 25.925H22.5C25.2 25.925 26.8 23.022 25.6 20.6195L16.6 3.80194C15.3 1.29934 11.8 1.29934 10.5 3.80194L1.5 20.6195C0.299997 23.022 1.9 25.925 4.6 25.925Z"
                                                stroke="#facea8" stroke-linecap="round"
                                                stroke-miterlimit="10"
                                                stroke-width="2" />
                                            <path
                                                d="M13.9 18.0168H13.2C12.5 18.0168 12.6 17.4162 12.6 16.7154L11.9 9.30769C11.9 8.60696 12.5 8.00635 13.2 8.00635H13.9C14.6 8.00635 15.2 8.60696 15.2 9.30769L14.5 16.7154C14.5 17.4162 14.6 18.0168 13.9 18.0168Z"
                                                fill="#facea8" />
                                            <path
                                                d="M13.5 21.9208C14.4389 21.9208 15.2 21.3382 15.2 20.6195C15.2 19.9008 14.4389 19.3181 13.5 19.3181C12.5611 19.3181 11.8 19.9008 11.8 20.6195C11.8 21.3382 12.5611 21.9208 13.5 21.9208Z"
                                                fill="#facea8" />
                                        </svg>
                                        <span class="modal__form-text">
                                            Bạn có chắc muốn xóa câu trả lời này?
                                        </span>
                                    </div>


                                    <div class="modal__form-btn">
                                        <button type="button"
                                            class="btn btn-danger modal__form-btn-remove-answer" data-bs-dismiss="modal">Xóa</button>

                                        <button class="btn btn-secondary"
                                            data-bs-dismiss="modal" >Bỏ qua</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
  
                <li class="main__form-item row gx-4">
                    <div class="col-md-1">
                        <div class="main__form-checkbox">
                            <label class="main__form-checkbox-input">
                                <input class="main__form-checkbox-radio" type="radio" name="radio${count}">
                                <span></span>
                            </label>
                        </div>
                    </div>
                    <div class="col-md-10">
                        <input type="text" name="Answer" class="form-control main__form-input"
                            placeholder="Nội dung câu trả lời">
                    </div>
                    <div class="col-md-1">
                        <button class="btn btn-danger main__form-btn"
                            data-bs-target="#removeAnswerC${countAnswer}" data-bs-toggle="modal">
                            <i class="fas fa-trash"></i>
                        </button>
  
                        <div class="modal modal__form show" id="removeAnswerC${countAnswer}"
                            tabindex="-1" aria-labelledby="removeAnswerC${countAnswer}"
                            aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content modal__form-content">
                                    <div class="main__modal-body">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            fill="none" height="120" viewBox="0 0 27 27"
                                            width="120">
                                            <path
                                                d="M4.6 25.925H22.5C25.2 25.925 26.8 23.022 25.6 20.6195L16.6 3.80194C15.3 1.29934 11.8 1.29934 10.5 3.80194L1.5 20.6195C0.299997 23.022 1.9 25.925 4.6 25.925Z"
                                                stroke="#facea8" stroke-linecap="round"
                                                stroke-miterlimit="10"
                                                stroke-width="2" />
                                            <path
                                                d="M13.9 18.0168H13.2C12.5 18.0168 12.6 17.4162 12.6 16.7154L11.9 9.30769C11.9 8.60696 12.5 8.00635 13.2 8.00635H13.9C14.6 8.00635 15.2 8.60696 15.2 9.30769L14.5 16.7154C14.5 17.4162 14.6 18.0168 13.9 18.0168Z"
                                                fill="#facea8" />
                                            <path
                                                d="M13.5 21.9208C14.4389 21.9208 15.2 21.3382 15.2 20.6195C15.2 19.9008 14.4389 19.3181 13.5 19.3181C12.5611 19.3181 11.8 19.9008 11.8 20.6195C11.8 21.3382 12.5611 21.9208 13.5 21.9208Z"
                                                fill="#facea8" />
                                        </svg>
                                        <span class="modal__form-text">
                                            Bạn có chắc muốn xóa câu trả lời này?
                                        </span>
                                    </div>


                                    <div class="modal__form-btn">
                                        <button type="button"
                                            class="btn btn-danger modal__form-btn-remove-answer" data-bs-dismiss="modal">Xóa</button>

                                        <button class="btn btn-secondary"
                                            data-bs-dismiss="modal">Bỏ qua</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
  
                <li class="main__form-item row gx-4">
                    <div class="col-md-1">
                        <div class="main__form-checkbox">
                            <label class="main__form-checkbox-input">
                                <input class="main__form-checkbox-radio" type="radio"  name="radio${count}">
                                <span></span>
                            </label>
                        </div>
                    </div>
                    <div class="col-md-10">
                        <input type="text" name="Answer" class="form-control main__form-input"
                            placeholder="Nội dung câu trả lời">
                    </div>
                    <div class="col-md-1">
                        <button class="btn btn-danger main__form-btn"
                            data-bs-target="#removeAnswerD${countAnswer}" data-bs-toggle="modal">
                            <i class="fas fa-trash"></i>
                        </button>

                        <div class="modal modal__form show" id="removeAnswerD${countAnswer}"
                            tabindex="-1" aria-labelledby="removeAnswerD${countAnswer}"
                            aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content modal__form-content">
                                    <div class="main__modal-body">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            fill="none" height="120" viewBox="0 0 27 27"
                                            width="120">
                                            <path
                                                d="M4.6 25.925H22.5C25.2 25.925 26.8 23.022 25.6 20.6195L16.6 3.80194C15.3 1.29934 11.8 1.29934 10.5 3.80194L1.5 20.6195C0.299997 23.022 1.9 25.925 4.6 25.925Z"
                                                stroke="#facea8" stroke-linecap="round"
                                                stroke-miterlimit="10"
                                                stroke-width="2" />
                                            <path
                                                d="M13.9 18.0168H13.2C12.5 18.0168 12.6 17.4162 12.6 16.7154L11.9 9.30769C11.9 8.60696 12.5 8.00635 13.2 8.00635H13.9C14.6 8.00635 15.2 8.60696 15.2 9.30769L14.5 16.7154C14.5 17.4162 14.6 18.0168 13.9 18.0168Z"
                                                fill="#facea8" />
                                            <path
                                                d="M13.5 21.9208C14.4389 21.9208 15.2 21.3382 15.2 20.6195C15.2 19.9008 14.4389 19.3181 13.5 19.3181C12.5611 19.3181 11.8 19.9008 11.8 20.6195C11.8 21.3382 12.5611 21.9208 13.5 21.9208Z"
                                                fill="#facea8" />
                                        </svg>
                                        <span class="modal__form-text">
                                            Bạn có chắc muốn xóa câu trả lời này?
                                        </span>
                                    </div>


                                    <div class="modal__form-btn">
                                        <button type="button"
                                            class="btn btn-danger modal__form-btn-remove-answer"
                                            data-bs-dismiss="modal">Xóa</button>

                                        <button class="btn btn-secondary"
                                            data-bs-dismiss="modal">Bỏ qua</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
  
        <div>
            <b>Thêm ảnh:</b>
            <div class="container-images">
                <input autocomplete="off" type="file" name="avatar" accept="image/*" multiple>
            </div>
        </div>

        <!-- Btn add Answer -->
        <button class="btn btn-danger main__question-body-btn">
            <i class="fas fa-plus main__exam-question-btn-add"></i>
            Thêm câu trả lời
        </button>
    </div>
  </li>`;
    $(".main__question-list").append(formEmpty);


    $('input[name="avatar"]').imageuploadify();
    $("input").attr("autocomplete", "off");

    let container = $('.main__question-list');

    container.find("li").each(function(index, element) {
        $(element).find('.main__question-body').each(function(index, element) {
            $(element).find('div').each(function(index, element) {
                $(element).find('.container-images').each(function(index, element) {
                    let colSize = $(element).find('.imageuploadify').length
                    $(element).find('.imageuploadify').each(function(index, element) {
                        if (colSize > 0 && index < colSize - 1) {
                            $(element).remove()
                        }
                    });
                });
            });
        });
    });


    for (let i = 0; i < btnAddAnswer.length; i++) {
        let clone = btnAddAnswer[i].cloneNode(true);
        btnAddAnswer[i].replaceWith(clone);
    }

    countAnswer = countAnswer;
    handleAddAnswer(count, countAnswer);
    handleRemoveAnswer();
    count = count;
    HandleHeaderClick();
}

// handle Create Sentence
function handleCreateSentence() {
    navHeader = document.querySelectorAll(".main__question-indicator");
    bodyList = document.querySelectorAll(".main__question-body");
    count += 1;

    navHeader.forEach((navItem) => {
        navItem.classList.remove("active");
    });
    bodyList.forEach((bodyItem) => {
        bodyItem.classList.remove("active");
    });

    let formSentence = `<li class="main__question-item">
    <div class="main__question-header">
        <div class="main__question-title">
            <h3 class="main__question-name">
                Nội dung câu tự luận
            </h3>
        </div>
        <div class="main__question-direction">

            <a href="" class="btn btn-danger main__question-close"
                data-bs-target="#sentence${count}" data-bs-toggle="modal">
                <i class="fas fa-times"></i>
            </a>


            <div class="modal modal__form show" id="sentence${count}" tabindex="-1"
                aria-labelledby="sentence${count}" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content modal__form-content">
                        <div class="main__modal-body">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                height="120" viewBox="0 0 27 27" width="120">
                                <path
                                    d="M4.6 25.925H22.5C25.2 25.925 26.8 23.022 25.6 20.6195L16.6 3.80194C15.3 1.29934 11.8 1.29934 10.5 3.80194L1.5 20.6195C0.299997 23.022 1.9 25.925 4.6 25.925Z"
                                    stroke="#facea8" stroke-linecap="round"
                                    stroke-miterlimit="10" stroke-width="2" />
                                <path
                                    d="M13.9 18.0168H13.2C12.5 18.0168 12.6 17.4162 12.6 16.7154L11.9 9.30769C11.9 8.60696 12.5 8.00635 13.2 8.00635H13.9C14.6 8.00635 15.2 8.60696 15.2 9.30769L14.5 16.7154C14.5 17.4162 14.6 18.0168 13.9 18.0168Z"
                                    fill="#facea8" />
                                <path
                                    d="M13.5 21.9208C14.4389 21.9208 15.2 21.3382 15.2 20.6195C15.2 19.9008 14.4389 19.3181 13.5 19.3181C12.5611 19.3181 11.8 19.9008 11.8 20.6195C11.8 21.3382 12.5611 21.9208 13.5 21.9208Z"
                                    fill="#facea8" />
                            </svg>
                            <span class="modal__form-text">
                                Bạn có muốn xóa câu tự luận này?
                            </span>
                        </div>


                        <div class="modal__form-btn">
                            <button type="button" data-bs-dismiss="modal"
                                class="btn btn-danger modal__form-btn-remove">Xóa</button>

                            <button class="btn btn-secondary" data-bs-dismiss="modal">Bỏ
                                qua</button>
                        </div>
                    </div>
                </div>
            </div>


            <span class="main__question-indicator active">
                <i class="fas fa-chevron-up"></i>
            </span>
        </div>
    </div>

    <div class="main__question-body active">
        <div class="col-md-12">
            <div class="form-floating main__question-input-content">
                <textarea class="form-control" placeholder="Leave a comment here"
                    id="floatingTextarea" name="contentQuestion"
                    style="height: 140px;"></textarea>
                <label for="floatingTextarea">Nội dung câu hỏi</label>
            </div>
        </div>
    </div>
</li>`

    $(".main__sentence-list").append(formSentence)
    count = count
    HandleHeaderClick()
}

function handleAddAnswer(count, countAnswer) {
    btnAddAnswer = document.querySelectorAll(".main__question-body-btn");

    //   Lắng nghe Btn add Answer
    for (let i = 0; i < btnAddAnswer.length; i++) {
        btnAddAnswer[i].addEventListener("click", function() {
            liLength = GetParent(
                i,
                btnAddAnswer[i],
                ".main__question-body"
            ).querySelectorAll(".main__form-item");

            if (liLength.length > 0) {
                count = GetParent(i, btnAddAnswer[i], ".main__question-body")
                    .querySelector(".main__form-checkbox-radio")
                    .name.replace(/[^0-9]/g, "");
            }

            countAnswer += 1;
            //   console.log(countAnswer);
            let answerItem = `<li class="main__form-item row gx-4">
                <div class="col-md-1">
                    <div class="main__form-checkbox">
                        <label class="main__form-checkbox-input">
                            <input type="radio" name="radio${count}">
                            <span></span>
                        </label>
                    </div>
                </div>
                <div class="col-md-10">
                    <input type="text" class="form-control main__form-input"
                        placeholder="Nội dung câu trả lời">
                </div>
                <div class="col-md-1">
                    <button class="btn btn-danger main__form-btn"
                        data-bs-target="#removeAnswerAl${countAnswer}" data-bs-toggle="modal">
                        <i class="fas fa-trash"></i>
                    </button>
            
            
                    <div class="modal modal__form show" id="removeAnswerAl${countAnswer}"
                        tabindex="-1" aria-labelledby="removeAnswerAl${countAnswer}"
                        aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content modal__form-content">
                                <div class="main__modal-body">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        fill="none" height="120" viewBox="0 0 27 27"
                                        width="120">
                                        <path
                                            d="M4.6 25.925H22.5C25.2 25.925 26.8 23.022 25.6 20.6195L16.6 3.80194C15.3 1.29934 11.8 1.29934 10.5 3.80194L1.5 20.6195C0.299997 23.022 1.9 25.925 4.6 25.925Z"
                                            stroke="#facea8" stroke-linecap="round"
                                            stroke-miterlimit="10"
                                            stroke-width="2" />
                                        <path
                                            d="M13.9 18.0168H13.2C12.5 18.0168 12.6 17.4162 12.6 16.7154L11.9 9.30769C11.9 8.60696 12.5 8.00635 13.2 8.00635H13.9C14.6 8.00635 15.2 8.60696 15.2 9.30769L14.5 16.7154C14.5 17.4162 14.6 18.0168 13.9 18.0168Z"
                                            fill="#facea8" />
                                        <path
                                            d="M13.5 21.9208C14.4389 21.9208 15.2 21.3382 15.2 20.6195C15.2 19.9008 14.4389 19.3181 13.5 19.3181C12.5611 19.3181 11.8 19.9008 11.8 20.6195C11.8 21.3382 12.5611 21.9208 13.5 21.9208Z"
                                            fill="#facea8" />
                                    </svg>
                                    <span class="modal__form-text">
                                        Bạn có chắc muốn xóa câu trả lời này?
                                    </span>
                                </div>
            
            
                                <div class="modal__form-btn">
                                    <button type="button"
                                        class="btn btn-danger modal__form-btn-remove-answer" data-bs-dismiss="modal">Xóa</button>
            
                                    <button class="btn btn-secondary"
                                        data-bs-dismiss="modal">Bỏ qua</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>`;

            btnAddAnswer[i]
                .closest(".main__question-body")
                .querySelector(".main__form-list")
                .insertAdjacentHTML("beforeend", answerItem);

            handleRemoveAnswer();
        });
        // countAnswer = countAnswer;
    }
    countAnswer = countAnswer;
}

// function handleSave(event) {
//   event.preventDefault();

//   const data = new FormData(event.target);

//   const value = Object.fromEntries(data.entries());
//   value.Answer = data.getAll("Answer");

//   console.log({
//     value,
//   });
// }

// const form = document.querySelector(".main__exam");
// form.addEventListener("save", handleSave);