// ===== TEST MODE =====
const today = new Date();   // REAL DATE
// const today = new Date("2026-02-16"); // change for testing
// =====================

const day = today.getDate();
const month = today.getMonth() + 1;

document.querySelectorAll('.box').forEach(box => {
  const boxDay = parseInt(box.dataset.day);
  if (month !== 2 || day < boxDay) {
    box.classList.add('locked');
  }
});

if (month === 2 && day > 14) {
  document.querySelectorAll('.box')
    .forEach(box => box.classList.remove('locked'));
}

function go(page) {
  window.location.href = "pages/" + page;
}

function valentineSuprise(){
  window.location.href = "../../love-surprise/index.html";
}
