const toggleVisibility = (checkboxId, elements) => {
  const checkbox = document.getElementById(checkboxId);

  checkbox.addEventListener("change", () => {
    elements.forEach((id) => {
      const el = document.getElementById(id);
      if (checkbox.checked) {
        el.classList.remove("hidden");
      } else {
        el.classList.add("hidden");
        if (el.tagName === "INPUT") el.value = "";
      }
    });
  });
};

toggleVisibility("useSpecial", [
  "specialCharsLabel",
  "specialChars",
  "numSpecialCharsLabel",
  "numSpecialChars",
]);

toggleVisibility("useNumbers", ["numDigitsLabel", "numDigits"]);

document
  .getElementById("generateBtn")
  .addEventListener("click", generateCombinations);

async function generateCombinations() {
  const length = parseInt(document.getElementById("length").value);
  const useLowercase = document.getElementById("useLowercase").checked;
  const useUppercase = document.getElementById("useUppercase").checked;
  const useNumbers = document.getElementById("useNumbers").checked;
  const useSpecial = document.getElementById("useSpecial").checked;

  const firstPart = document.getElementById("firstPart").value;
  const lastPart = document.getElementById("lastPart").value;

  const customSpecialChars =
    document.getElementById("specialChars").value || "!@#$%^&*()";

  const numSpecialChars =
    parseInt(document.getElementById("numSpecialChars").value) || 0;
  const numDigits =
    parseInt(document.getElementById("numDigits").value) || 0;

  const output = document.getElementById("output");
  const totalDisplay = document.getElementById("totalCombinations");

  output.innerHTML = "";
  totalDisplay.innerText = "";

  if (!length) {
    output.innerText = "Please enter word length.";
    return;
  }

  let charSet = "";
  if (useLowercase) charSet += "abcdefghijklmnopqrstuvwxyz";
  if (useUppercase) charSet += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (useNumbers) charSet += "0123456789";
  if (useSpecial) charSet += customSpecialChars;

  if (!charSet) {
    output.innerText = "Select at least one character type.";
    return;
  }

  const remainingLength =
    length - firstPart.length - lastPart.length;

  if (remainingLength < 0) {
    output.innerText = "First + Last part exceeds total length.";
    return;
  }

  let total = 0;

  async function generate(current = "", sc = 0, dc = 0) {
    if (current.length === remainingLength) {
      if (sc === numSpecialChars && dc === numDigits) {
        const div = document.createElement("div");
        div.textContent = firstPart + current + lastPart;
        output.appendChild(div);
        total++;
      }
      return;
    }

    for (let ch of charSet) {
      const newSc = sc + (customSpecialChars.includes(ch) ? 1 : 0);
      const newDc = dc + (ch >= "0" && ch <= "9" ? 1 : 0);

      if (newSc <= numSpecialChars && newDc <= numDigits) {
        await generate(current + ch, newSc, newDc);
      }
    }
  }

  await generate();
  totalDisplay.innerText = `Total Combinations: ${total}`;
}
