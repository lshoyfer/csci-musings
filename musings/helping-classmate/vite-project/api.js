let data = [];
let html = "";
let imgBuffer = [Promise.resolve(setTimeout(() => {
  console.log('resolved!');
}, 100))];

let DOMSelectors = {
  container: document.getElementById("container"),
  
};

export async function getCats() {
  let api_url = `https://cataas.com/api/cats?limit=1114`;
  let response = await fetch(api_url);
  data = await response.json();
  console.log(data);
}

export async function makeHtml(numCats, resolveCallback) {
  const buildEvent = new Event('build');
  DOMSelectors.container.addEventListener('build', (e) => {

  });
  for (let i = 0; i < numCats; i++) {
    let id = getRandom(data, numCats)[i]._id;
    console.log(id);
    const img = new Image();
    img.onload = () => queueMicrotask(async () => {
      imgBuffer.push(Promise.resolve(img));
      console.log(`img ${i} rdy`);
      console.log(await Promise.all(imgBuffer));
      // queueMicrotask(() => { 
      //   Promise.all(imgBuffer).then(() => console.log('all ready'));
      // });
    });
    img.src = `https://cataas.com/cat/${id}`
    // img.innerHTML = `<img src='https://cataas.com/cat/${id}' id='cat${i + 1}' class='cats'>`;
    img.classList.add('cats');
    img.id = `cat${i+1}`;
    const test = DOMSelectors.container.appendChild(img);
    console.log('just added:', test);
    // console.log(html);
    img.dispatchEvent(new CustomEvent('load', { detail: 'test' }))
  }
}

export async function makeCats() {
  // DOMSelectors.container.insertAdjacentElement("beforebegin", document.createElement(html));
  html = "";
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
