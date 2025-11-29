let timer;
let count = 10;

const display = document.getElementById("countdown");
const startButton = document.getElementById("startButton");

startButton.addEventListener("click", function () {
  clearInterval(timer);   // garante que não cria dois timers
  count = 10;             // reinicia contagem
  display.textContent = count;

  timer = setInterval(() => {
    count--;
    display.textContent = count;

    if (count <= 0) {
      clearInterval(timer);
      display.textContent = "Time's up!";
    }
  }, 1000);
});
