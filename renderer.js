document.write = () => { console.error('document.write() is disabled.')};
window.eval = () => { console.error('document.write() is disabled.') };
window.alert = () => { console.error('document.write() is disabled.') };

function postToChild(targetFrame, txt, targetOrigin) {
  try {
    document
      .getElementById("childFrame" + targetFrame)
      .contentWindow.postMessage({ command: "say", arg: txt }, targetOrigin);
  } catch (e) {
    sayInBlockScope(`postToChild() error: ${e}`);
  }
}

function sayToChildInGlobalScope(targetFrame, txt) {
  try {
    document.getElementById("childFrame" + targetFrame).contentWindow.sayInGlobalScope(txt);
  } catch (e) {
    sayInBlockScope(`sayToChildInGlobalScope() error: ${e}`);
  }
}

function sayToChildInBlockScope(targetFrame, txt) {
  try {
    document.getElementById("childFrame" + targetFrame).contentWindow.sayInBlockScope(txt);
  } catch (e) {
    sayInBlockScope(`sayToChildInBlockScope() error: ${e}`);
  }
}

function sayInGlobalScope(txt){
  document
    .getElementById("result")
    .insertAdjacentHTML("beforeend", `${txt}<br>`);
}

const sayInBlockScope = (txt) => {
  document
    .getElementById("result")
    .insertAdjacentHTML("beforeend", `${txt}<br>`);
}

function receiveMessage(event) {
  if(event.origin !== 'file://'){
    sayInBlockScope('invalid origin');
    return;
  }
  if (!event.data.command) {
    return;
  }
  if (event.data.command === "say" && event.data.arg !== undefined) {
    sayInBlockScope(event.data.arg);
  }
}

const onload = () => {
  console.log('loaded');
};

window.addEventListener("message", receiveMessage, false);
window.addEventListener('load', onload);