
function ord_xhr(opts) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", opts.serverAddress, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    return xhr;
}

function ord_xhrToPromise(xhr, obj) {
    return new Promise(function (resolve, reject) {
        xhr.onload = function () {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.response);
          } else {
            reject({
              status: xhr.status,
              statusText: xhr.statusText
            });
          }
        };
        xhr.onerror = function () {
          reject({
            status: xhr.status,
            statusText: xhr.statusText
          });
        };
        xhr.send(JSON.stringify(obj));
      });
}

async function ord_createFolder(opts, folderPath) {
    let xhr = ord_xhr(opts);
    return ord_xhrToPromise(xhr, {
        method: "CreateFolder",
        payload: {
            folderPath: folderPath,
        },
    });
}

async function ord_printPage(opts, folderPath, fileName) {
    let xhr = ord_xhr(opts);
    return ord_xhrToPromise(xhr, {
        method: "PrintPage",
        payload: {
            folderPath: folderPath, 
            fileName: fileName,
            fullPath: `${folderPath}\\${fileName}`,
        },
    });
}

async function ord_ping(opts) {
  let xhr = ord_xhr(opts);
  return ord_xhrToPromise(xhr, {
    method: "Ping",
    payload: {},
  });
}