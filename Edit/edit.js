const dom_AddContent = document.querySelector("#AddContent");
const dom_Add = document.querySelector("#addQ");
const dom_cancel = document.querySelector("#cancelBtn");
const dom_form = document.querySelector(".formAction");
const dom_container = document.querySelector(".container");

// Load questions from localStorage
let questions = JSON.parse(localStorage.getItem("quizQuestions")) || [];
let editingIndex = -1; // Track if we're editing

dom_Add.addEventListener("click", onAdd);
dom_cancel.addEventListener("click", onCancel);
dom_form.addEventListener("submit", onSubmit);

// Load saved questions on page load
loadSavedQuestions();
attachDefaultQuestionListeners();

function hide(element) {
  // TODO
  element.style.display = "none";
}

function show(element) {
  // TODO
  element.style.display = "flex";
}

function attachDefaultQuestionListeners() {
  const defaultCards = document.querySelectorAll(".question-card");
  defaultCards.forEach((card, index) => {
    const editIcon = card.querySelector(".edit-icon");
    const deleteIcon = card.querySelector(".delete-icon");

    if (editIcon && !editIcon.hasListener) {
      editIcon.hasListener = true;
      editIcon.addEventListener("click", function () {
        const questionText = card.querySelector(".question-text").textContent;
        editingIndex = -1;
        document.querySelector("#question").value = questionText;
        document.querySelector("#optionA").value = "";
        document.querySelector("#optionB").value = "";
        document.querySelector("#optionC").value = "";
        document.querySelector("#optionD").value = "";
        document.querySelector("#correctAnswer").value = "";

        const submitBtn = document.querySelector("#submitAddQ");
        submitBtn.textContent = "Update Question";
        show(dom_AddContent);
      });
    }

    // Add delete listener
    if (deleteIcon && !deleteIcon.hasListener) {
      deleteIcon.hasListener = true;
      deleteIcon.addEventListener("click", function () {
        card.remove();
      });
    }
  });
}

function loadSavedQuestions() {
  // Load and display saved questions
  questions.forEach((q, index) => {
    addQuestionCard(q, index);
  });
}

function addQuestionCard(questionObj, index) {
  const newCard = document.createElement("div");
  newCard.className = "question-card";
  newCard.innerHTML = `
    <span class="question-text">${questionObj.question}</span>
    <div class="actions">
      <span class="edit-icon">&#9998;</span>
      <span class="delete-icon">&#128465;</span>
    </div>
  `;

  // Add edit
  const editIcon = newCard.querySelector(".edit-icon");
  editIcon.addEventListener("click", function () {
    editingIndex = index;
    document.querySelector("#question").value = questionObj.question;
    document.querySelector("#optionA").value = questionObj.optionA;
    document.querySelector("#optionB").value = questionObj.optionB;
    document.querySelector("#optionC").value = questionObj.optionC;
    document.querySelector("#optionD").value = questionObj.optionD;
    document.querySelector("#correctAnswer").value = questionObj.correctAnswer;

    const submitBtn = document.querySelector("#submitAddQ");
    submitBtn.textContent = "Update Question";
    show(dom_AddContent);
  });

  // delete
  const deleteIcon = newCard.querySelector(".delete-icon");
  deleteIcon.addEventListener("click", function () {
    questions.splice(index, 1);
    localStorage.setItem("quizQuestions", JSON.stringify(questions));
    loadSavedQuestions();
  });

  // Insert
  const btnAdd = document.querySelector(".btn-add");
  dom_container.insertBefore(newCard, btnAdd);
}

function onAdd() {
  // Reset when adding new question
  editingIndex = -1;
  dom_form.reset();
  show(dom_AddContent);
}

function onCancel() {
  // Reset editing state
  editingIndex = -1;
  dom_form.reset();
  hide(dom_AddContent);
}

function onSubmit(e) {
  e.preventDefault();

  // Get value from user inputs
  const question = document.querySelector("#question").value;
  const optionA = document.querySelector("#optionA").value;
  const optionB = document.querySelector("#optionB").value;
  const optionC = document.querySelector("#optionC").value;
  const optionD = document.querySelector("#optionD").value;
  const correctAnswer = document.querySelector("#correctAnswer").value;

  // Create question
  const questionObj = {
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer,
  };

  if (editingIndex > -1) {
    // Update existing question
    questions[editingIndex] = questionObj;
    editingIndex = -1;
  } else {
    // Add new question
    questions.push(questionObj);
  }

  // Save to localStorage
  localStorage.setItem("quizQuestions", JSON.stringify(questions));

  loadSavedQuestions();
  dom_form.reset();
  hide(dom_AddContent);
}
