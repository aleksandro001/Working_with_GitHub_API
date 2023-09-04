const gitRep = document.getElementById("searchGitRep");
const answerSearch = document.querySelector(".repository__answer-search");
const carts = document.querySelector(".carts");
let fragment = new DocumentFragment();
let listAnswer;

function debounce(fn, debounceTime) {
  let timeout;
  return function () {
    const fnCall = () => {
      fn.apply(this, arguments);
    };
    clearTimeout(timeout);
    timeout = setTimeout(fnCall, debounceTime);
  };
}

async function getRepositories() {
  await fetch(
    `https://api.github.com/search/repositories?q=${gitRep.value}&per_page=5`
  )
    .then((response) => response.json())
    .then((response) => (listAnswer = response.items));
  try {
    listAnswer.forEach((element, index) => {
      let div = document.createElement("div");
      div.textContent = `${element.name}`;
      div.className = "re";
      div.dataset.number = index;
      fragment.append(div);
    });
    if (!answerSearch.childNodes.length) {
      answerSearch.append(fragment);
    } else {
      answerSearch.childNodes.forEach((element, index) => {
        element.textContent = listAnswer[index].name;
      });
    }
  } catch (err) {
    answerSearch.textContent = "";
  }
}

answerSearch.addEventListener("click", (e) => {
  let div = document.createElement("div");
  let span = document.createElement("span");
  span.className = "skull";
  div.className = "cart";
  const indexAnswer = e.target.dataset.number;
  div.insertAdjacentHTML(
    "afterbegin",
    `<p>Name: <span>${listAnswer[indexAnswer].name}</span></p> <p> Owner: <span>${listAnswer[indexAnswer].owner.login}</span></p> <p>Stargazers: <span>${listAnswer[indexAnswer].stargazers_count}</span></p>`
  );

  div.prepend(span);
  carts.append(div);
  answerSearch.innerHTML = "";
  gitRep.value = "";
});
carts.addEventListener("click", (event) => {
  if (event.target.classList.contains("skull"))
    event.target.parentElement.remove();
});

getRepositories = debounce(getRepositories, 400);

gitRep.addEventListener("keydown", (e) => {
  if (!(e.code === "Space" || e.code === "Enter")) return getRepositories();
});
