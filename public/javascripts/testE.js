const questionList = document.querySelectorAll(".testExam__form-item");
let tableResult = document.querySelector(".testExam__submit-result");
let arrayCharacter = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
let essayList = document.querySelectorAll(".testExam__form-essay-item");
let tableText = document.querySelector(".testExam__submit-list");
let btnEnd = document.querySelector(".testExam__submit-btn");
let resultList;
let submitText;

function start() {
    handleRenderTabResult();
    handleRenderEssay();
}
start();

function handleRenderTabResult() {
    for (let i = 1; i <= questionList.length; i++) {
        let countQues;
        if (i < 10) {
            countQues = "0" + i;
        } else {
            countQues = i;
        }
        let renderQuestion = `<a href="#question${i}" class="testExam__submit-result-item">
      <span>${countQues}</span>
      <span class="testExam__submit-result-position">A</span>
  </a>`;
        tableResult.innerHTML += renderQuestion;
    }

    for (let i = 0; i < questionList.length; i++) {
        let itemRadio = questionList[i].querySelectorAll('input[type = "radio"]');

        for (let j = 0; j < itemRadio.length; j++) {
            // console.log(itemRadio[j]);
            itemRadio[j].addEventListener("change", function() {
                if (itemRadio[j].checked) {
                    let positionTable = document
                        .querySelectorAll(".testExam__submit-result-item")[i].querySelector(".testExam__submit-result-position");

                    // console.log(j);
                    positionTable.classList.add("active");
                    positionTable.innerText = arrayCharacter[j];
                }
            });
        }
    }
}

function handleRenderEssay() {
    for (let i = 0; i < essayList.length; i++) {
        let renderEssay = `<li class="testExam__submit-item">
    <a href="#essay${i}" class="testExam__submit-link">
        <span class="testExam__submit-text">.</span>
    </a>
  </li>`;
        tableText.innerHTML += renderEssay;

        submitText = document.querySelectorAll(".testExam__submit-text");

        essayList[i].addEventListener("input", function(e) {
            submitText[i].textContent = e.target.value;
        });
    }
}

btnEnd.addEventListener("click", function() {
    resultList = document.querySelectorAll(".testExam__submit-result-item");

    let countResult = 0;
    for (i = 0; i < resultList.length; i++) {
        let checkResult = resultList[i].querySelector(
            ".testExam__submit-result-position.active"
        );
        if (checkResult) {
            countResult += 1;
        }
    }
    if (countResult < resultList.length) {
        Swal.fire({
            title: "",
            text: "Bạn chưa trả lời hết số câu hỏi! .\n  Bạn có chắc chắn muốn nộp bài?",
            icon: "warning",
            confirmButtonColor: "#bb2d3b",
            html: "Bạn chưa trả lời hết số câu hỏi!",
        });
    } else {
        Swal.fire({
            title: "",
            text: " Bạn có muốn nộp bài?",
            icon: "warning",
            confirmButtonColor: "#bb2d3b",
            confirmButtonText: "Nộp bài",
            showCancelButton: true,
            cancelButtonText: "Hủy",
        }).then((result) => {

            let tb = $('.testExam__form-list')
            let answerChoice = []

            tb.find("li").each(function(index, element) {
                let counter = 0
                $(element).find('ul').each(function(index, element) {
                    $(element).find('li').each(function(index, element) {
                        $(element).find('.testExam__question-check').each(function(index, element) {
                            $(element).find('input').each(function(index, element) {
                                if($(element).is(':checked')){
                                    answerChoice.push(counter)
                                }else{
                                    counter++
                                }
                            })

                            
                        })
                    })
                })
            })


            tb = $('.testExam__form-essay')
            let answerEssay = []

            tb.find(".testExam__form-essay-item").each(function(index, element) {
                let counter = 0
                $(element).find('.testExam__form-essay-input').each(function(index, element) {
                    $(element).find('textarea').each(function(index, element) {
                        answerEssay.push($(element).val())
                    })
                })
            })

            $.ajax({
                type: 'POST',
                url: '/answer-topic/answer',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'token': getCookie('token')
                },
                data: {
                    name : getCookie('name'),
                    phone : getCookie('phone'),
                    answers : JSON.stringify({
                        choice_questions : answerChoice,
                        essay_questions : answerEssay
                      }),
                  code :  urlParams.get('code'),
                },
                cache: false,
                success: function(response) {
                    //console.log(response)
                    //window.location.replace('./../../admin/exams')
                },
                error: function(data) {

                }
            })

            // when click submit
            if (result.isConfirmed) {
                // Swal.fire("Saved!", "", "success");
            }
        });
    }
});