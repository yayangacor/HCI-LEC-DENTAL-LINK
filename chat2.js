const textarea = document.querySelector(".chat-textarea");

textarea.addEventListener("input", () => {
textarea.style.height = "auto";
textarea.style.height = textarea.scrollHeight + "px";
});

textarea.addEventListener("keydown", (e) => {
if (e.key === "Enter" && !e.shiftKey) {
e.preventDefault();

if (textarea.value.trim() !== "") {
alert("Pesan terkirim!");
textarea.value = "";
textarea.style.height = "44px";
}
}
});