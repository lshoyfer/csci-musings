let data = [];
let DOMSelectors = {
  container: document.getElementById("container"),
};


export async function getCats(n) {
  DOMSelectors.container.textContent = 'Loading...';
  let reqs = [];
  for (let i = 0; i < n; i++) {
    reqs.push(fetch('https://cataas.com/cat?json=true'))
  }
  return Promise.all(reqs);
}

export function makeCatsHTML(arr) {
  for (let i = 0; i < arr.length; i++) {
    let id = arr[i]._id;
    const img = new Image();
    img.onload = () => { DOMSelectors.container.appendChild(img); }
    img.src = `https://cataas.com/cat/${id}`;
    img.classList.add('cats');
    img.id = `cat${i + 1}`;
  };
}