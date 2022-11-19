import "./style.css";
import * as api from "./api.js";

let DOMSelectors = {
  container: document.getElementById("container"),
};

(async () => {
  await api.getCats();
  await api.makeCatsHTML(10);
  console.log(api.reruns);
})()

// btw due to top level await this is included in the microtask
// (js doesn't know whether this depends on the async code)
// so either moving the EventListener above the await calls or
// scoping the await calls will work, otherwise the form
// waits for the cats to load before hydration i.e. it's
// functionless. Above u can see I went with scoping.
form.addEventListener("submit", async function (e) {
  let numCats = 0;
  e.preventDefault();
  console.log('yo');
  let input = document.getElementById("num");
  numCats = input.value;
  console.log(input.value);
  input.value = "";
  await api.makeCatsHTML(numCats);
});
