function t(){const o=document.createElement("dialog");o.innerHTML=`
    <form method="dialog">
      <p>This is a dialog!</p>
      <button type="submit">Close</button>
    </form>
  `,document.body.appendChild(o),o.showModal()}document.body.addEventListener("click",t);
