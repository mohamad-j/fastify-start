/// Functio that popup a dialog whenever clicked on the document body
function showDialog() {
  const dialog = document.createElement('dialog');
  dialog.innerHTML = `
    <form method="dialog">
      <p>This is a dialog!</p>
      <button type="submit">Close</button>
    </form>
  `;
  document.body.appendChild(dialog);
  dialog.showModal();
}

// Add an event listener to the document body to show the dialog on click
document.body.addEventListener('click', showDialog);