const xhr = new XMLHttpRequest();
const gitRep = document.getElementById("searchGitRep")
const answerSearch = document.querySelector('.repository__answer-search')

const carts = document.querySelector('.carts')
let fragment = new DocumentFragment();
let searchList
let answerLint

function debounce  (fn, debounceTime)  {
    let timeout;
    return function() {
        const fnCall = () => {fn.apply(this, arguments)}
        clearTimeout(timeout);
        timeout = setTimeout(fnCall, debounceTime)
    }
  }


function getRepositories () {
    try {
        xhr.open("GET", `https://api.github.com/search/repositories?q=${gitRep.value}&per_page=5`);
        xhr.send();
    }
    catch (err){

    }
}
xhr.addEventListener('load',() => {
    try {
        searchList = JSON.parse(xhr.response);
         answerLint = searchList.items
        answerLint.forEach((element, index) => {
            let div = document.createElement('div');
            div.textContent = `${element.name}`
            div.className = 're'
            div.dataset.number = index
            fragment.append(div)
        })
        if (!answerSearch.childNodes.length) {
            answerSearch.append(fragment)
        } else {
            answerSearch.childNodes.forEach((element, index) => {
                element.textContent = answerLint[index].name
            })
        }
    }
    catch (err){
        answerSearch.textContent = ''
    }


});

answerSearch.addEventListener('click', (e) => {
    let fragment = new DocumentFragment();
    let div = document.createElement('div');
    let span = document.createElement('span');
    span.className = 'skull'
    div.className = 'cart'
    const indexAnswer = e.target.dataset.number
    div.innerHTML = `<p>Name: <span>${answerLint[indexAnswer].name}</span></p> <p> Owner: <span>${answerLint[indexAnswer].owner.login}</span></p> <p>Stargazers: <span>${answerLint[indexAnswer].stargazers_count}</span></p>`

    div.prepend(span)
    carts.append(div)
    answerSearch.innerHTML = ''
})
carts.addEventListener('click', (event) => {
    if(event.target.classList.contains('skull')) event.target.parentElement.remove()
})
getRepositories = debounce(getRepositories, 300)



gitRep.addEventListener('keydown',getRepositories)

