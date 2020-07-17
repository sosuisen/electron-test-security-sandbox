const receiveMessage = (event) => {
  console.log('event.origin: ' + event.origin);
  if(event.origin !== 'file://'){
    sayInBlockScope('Not expected origin (file://): ' + event.origin);
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

const setAttrOfIframe = (id, attrName, value) => {
  const children = parent.document.body.childNodes;
  for (let i = 0; i < children.length; i++) {
    if(children[i].id == id){
      children[i].setAttribute(attrName, value);
      sayInBlockScope(attrName + ' is set to ' + value);
    }
  }
}

const removeAPIs = () => {
  // Remove APIs
  const disableAPIList = [
    'open',
    'alert',
    'confirm',
    'prompt',
    'print'
  ];
  disableAPIList.forEach((prop) => {
    window[prop] = () => { console.error(prop + ' is disabled.'); };
  });
};

const onload = () => {
  // Remove APIs
  /* 
  const disableAPIList = [
    'open',
    'alert',
    'confirm',
    'prompt',
    'print'
  ];
  disableAPIList.forEach((prop) => {
    window[prop] = () => { console.error(prop + ' is disabled.'); };
  });
  */
};
window.addEventListener("message", receiveMessage, false);
window.addEventListener('load', onload);