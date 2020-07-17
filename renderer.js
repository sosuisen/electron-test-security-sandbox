let result = null;

const postToChild = (targetFrame, txt, targetOrigin) => {
  try {
    document
      .getElementById("childFrame" + targetFrame)
      .contentWindow.postMessage({ command: "say", arg: txt }, targetOrigin);
  } catch (e) {
    sayInBlockScope(`postToChild() error: ${e}`);
  }
}

const sayToChildInGlobalScope = (targetFrame, txt) => {
  try {
    document.getElementById("childFrame" + targetFrame).contentWindow.sayInGlobalScope(txt);
  } catch (e) {
    sayInBlockScope(`sayToChildInGlobalScope() error: ${e}`);
  }
}

const sayToChildInBlockScope = (targetFrame, txt) => {
  try {
    document.getElementById("childFrame" + targetFrame).contentWindow.sayInBlockScope(txt);
  } catch (e) {
    sayInBlockScope(`sayToChildInBlockScope() error: ${e}`);
  }
}

const documentWriteToChild = (targetFrame, txt) => {
  try {
    document.getElementById("childFrame" + targetFrame).contentWindow.document.write(txt);
  } catch (e) {
    sayInBlockScope(`documentWriteToChild() error: ${e}`);
  }
}

function sayInGlobalScope(txt){
  result.insertAdjacentHTML("beforeend", `${txt}<br>`);
}

const sayInBlockScope = (txt) => {
  result.insertAdjacentHTML("beforeend", `${txt}<br>`);
}

const receiveMessage = (event) => {
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

const localWin = {};
const localDoc = {};
const removeGlobalPropertiesExcept = [
  'document',
  'location',
  'postMessage'
];


const removeGlobalProperties = () => {
  for (let prop in window) {
    console.log(prop + ': ' + typeof window[prop]);
    if (removeGlobalPropertiesExcept.lastIndexOf(prop) < 0) {
      try {
        if(typeof window[prop] === 'function'){
          // bind window to keep 'this'
          localWin[prop] = window[prop].bind(window);
          window[prop] = () => { console.error(prop + ' is disabled.'); };
        }
        else if(typeof window[prop] === 'object'){
          localWin[prop] = window[prop];
          window[prop] = {};
          delete window[prop];
        }
        else {
          // nop
        }
      }
      catch {
        console.error('fail to delete: ' + prop)
      }
    }
  }

  for (let prop in window.document) {
    console.log(prop + ': ' + typeof window.document[prop]);
    try {
      if(typeof window.document[prop] === 'function'){
        if(!prop.match(/^getElement/) && !prop.match(/^querySelector/)){
          // bind window.document to keep 'this'
          localDoc[prop] = window.document[prop].bind(window.document);
          window.document[prop] = () => { console.error(prop + ' is disabled.'); };
        }
      }
      else if(typeof window.document[prop] === 'object'){
        localDoc[prop] = window.document[prop];
        delete window.document[prop];
      }
      else {
        // nop
      }
    }
    catch {
      console.error('fail to delete: ' + prop)
    }
  }
}

const onload = () => {
  console.log('loaded');
  result = document.getElementById("result");

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

window.addEventListener("message", receiveMessage, false);
window.addEventListener('load', onload);