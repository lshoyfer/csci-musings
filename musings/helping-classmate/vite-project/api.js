let data = [];
let _imgSyncBuffer = [];
let DOMSelectors = {
  container: document.getElementById("container"),
};
let reruns = 0;
const imgBuffer = new Promise((resolve) => {
  if (++reruns && (_imgSyncBuffer.length === DOMSelectors.container.childElementCount)) {
    // can resolve null / anything else but perhaps its of use to have
    // an array of the dom elements ¯\_(ツ)_/¯ do as you may
    resolve(_imgSyncBuffer);
  }
});

export async function getCats() {
  let api_url = `https://cataas.com/api/cats?limit=50`;
  let response = await fetch(api_url);
  data = await response.json();
  // console.log(data);
}

export async function makeCatsHTML(numCats) {
  for (let i = 0; i < numCats; i++) {
    let id = getRandom(data, numCats)[i]._id;
    const img = new Image();
    img.onload = () => { DOMSelectors.container.appendChild(img); }
    img.src = `https://cataas.com/cat/${id}`;
    img.classList.add('cats');
    img.id = `cat${i + 1}`;
    _imgSyncBuffer.push(img);
  };
  return imgBuffer;
}

function getRandom(arr, n) {
  let result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    let x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

export {reruns};