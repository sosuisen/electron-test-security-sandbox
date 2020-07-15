document.write = () => { console.error('document.write() is disabled.')};
window.eval = () => { console.error('document.write() is disabled.') };
window.alert = () => { console.error('document.write() is disabled.') };

function postToChild(targetFrame, txt, targetOrigin) {
  try {
    document
      .getElementById("childFrame" + targetFrame)
      .contentWindow.postMessage({ command: "say", arg: txt }, targetOrigin);
  } catch (e) {
    say(`postToChild() error: ${e}`);
  }
}

function sayToChild(targetFrame, txt) {
  try {
    document.getElementById("childFrame" + targetFrame).contentWindow.say(txt);
  } catch (e) {
    say(`sayToChild() error: ${e}`);
  }
}
function say(txt){
  document
    .getElementById("result")
    .insertAdjacentHTML("beforeend", `${txt}<br>`);
}

function receiveMessage(event) {
  if(event.origin !== 'file://'){
    say('invalid origin');
    return;
  }
  if (!event.data.command) {
    return;
  }
  if (event.data.command === "say" && event.data.arg !== undefined) {
    say(event.data.arg);
  }
}

const onload = () => {
  console.log('loaded');
};

window.addEventListener("message", receiveMessage, false);
window.addEventListener('load', onload);