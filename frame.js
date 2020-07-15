const receiveMessage = (event) => {
  if(event.origin !== 'file://'){
    return;
  }
  if (!event.data.command) {
    return;
  }
  if (event.data.command === "say" && event.data.arg !== undefined) {
    sayInBlockScope(event.data.arg);
  }
}

const sayToParentInGlobalScope = (txt) => {
  try{
    parent.sayInGlobalScope(txt);
  } catch(e){
    sayInBlockScope(`sayToParentInGlobalScope() error: ${e}`);
  }
}

const sayToParentInBlockScope = (txt) => {
  try{
    parent.sayInBlockScope(txt);
  } catch(e){
    sayInBlockScope(`sayToParentInBlockScope() error: ${e}`);
  }
}

const postToParent = (txt, targetOrigin) => {
  parent.postMessage({ command: "say", arg: txt }, targetOrigin);
}

function sayInGlobalScope(txt) {
  document.getElementById("result").insertAdjacentHTML("beforeend", `${txt}<br>`);
}

const sayInBlockScope = (txt) => {
  document.getElementById("result").insertAdjacentHTML("beforeend", `${txt}<br>`);
}

window.addEventListener("message", receiveMessage, false);
