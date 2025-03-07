const input = document.getElementById("input");
const autocompleteList = document.querySelector(".autocompleteList");
const responseContainer = document.querySelector(".responseContainer");
const container = document.querySelector(".container");

const debounce = (fn, debounceTime = 0) => {
  let timer;

  return function (...args) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(this, args);
    }, debounceTime);
  };
};

function addRepository(repository) {
  if (container.children.length >= 3) {
    container.lastChild.remove();
  }

  const fragment = document.createDocumentFragment();

  const containerResponseContainer = document.createElement("div");
  containerResponseContainer.classList.add("container__responseContainer");

  const responseContainerLeftSide = document.createElement("div");
  responseContainerLeftSide.classList.add("responseContainer__leftSide");

  const responseText1 = document.createElement("span");
  responseText1.classList.add("response__text");
  responseText1.textContent = `Name: ${repository.name}`;
  const responseText2 = document.createElement("span");
  responseText2.textContent = `Owner: ${repository.owner.login}`;
  responseText2.classList.add("response__text");
  const responseText3 = document.createElement("span");
  responseText3.classList.add("response__text");
  responseText3.textContent = `Stars: ${repository.stargazers_count}`;

  const responseContainerDelete = document.createElement("div");
  responseContainerDelete.classList.add("responseContainer--delete");

  responseContainerLeftSide.append(responseText1);
  responseContainerLeftSide.append(responseText2);
  responseContainerLeftSide.append(responseText3);

  containerResponseContainer.append(responseContainerLeftSide);
  containerResponseContainer.append(responseContainerDelete);
  fragment.append(containerResponseContainer);
  container.prepend(fragment);

  containerResponseContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("container__responseContainer")) {
      window.open(repository.html_url, "_blank");
    }
    if (event.target.classList.contains("responseContainer--delete")) {
      event.target.closest(".container__responseContainer").remove();
    }
  });
}

function getDropDownMenu(keyWord) {
  if (!keyWord) {
    autocompleteList.innerHTML = "";
    return;
  }
  return fetch(
    `https://api.github.com/search/repositories?q=${keyWord}&per_page=5`
  )
    .then((response) => response.json())
    .then((response) =>
      response.items.slice(0, 5).forEach((obj) => {
        if (autocompleteList.children.length >= 5) {
          autocompleteList.innerHTML = "";
        }
        const list = document.createElement("li");
        list.classList.add("dropDownMenu");
        list.textContent = obj.name;
        list.onclick = () => {
          input.value = "";
          autocompleteList.innerHTML = "";
          addRepository(obj);
        };
        autocompleteList.append(list);
      })
    );
}

input.addEventListener(
  "input",
  debounce((event) => {
    getDropDownMenu(event.target.value.trim());
  }, 500)
);
