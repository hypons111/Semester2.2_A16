const BASE_URL = 'https://lighthouse-user-api.herokuapp.com/api/v1/users/'
const dataPanel = document.querySelector("#data-panel")
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")
const favoriteUsers = JSON.parse(localStorage.getItem("favoriteUsers")) || []


renderUserList(favoriteUsers)
let a = true

// 詳細資料、Favorite 功能
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches('.btn-show-user')) {
    showUserModel(event.target.dataset.id)
  } else if (event.target.matches('.btn-add-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})


function renderUserList(data) {
  let rawHTML = ""
  data.forEach(user => {
    rawHTML +=
      `<div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img src="${user.avatar}" class="card-img-top" alt="User Profile Picture" />
            <div class="card-body">
              <h5 class="card-title">${user.name} ${user.surname}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-user" data-toggle="modal" data-target="#user-modal" data-id="${user.id}">
                More
              </button>
              <button class="btn btn-danger btn-add-favorite" data-id="${user.id}">X</button>
            </div>
          </div>
        </div>
      </div>`
  })
  dataPanel.innerHTML = rawHTML
}

function showUserModel(id) {
  const userName = document.querySelector("#user-modal-name")
  const userAvatar = document.querySelector("#user-modal-avatar")
  const userInfo = document.querySelector("#user-modal-info")
  axios.get(BASE_URL + id)
    .then(response => {
      const user = response.data
      userName.innerText = `${user.name} ${user.surname}`
      userAvatar.innerHTML = `<img class="h-100 d-inline-block" src="${user.avatar}" alt="movie-poster" class="img-fluid" >`
      userInfo.innerHTML = `<p><strong>Age: </strong>${user.age}</p>
                            <p><strong>Email: </strong>${user.email}</p>
                            <p><strong>Gender: </strong>${user.gender}</p>
                            <p><strong>Region: </strong>${user.region}</p>
                            <p><strong>Birthday: </strong>${user.birthday}</p>
                            <p><strong>Created at: </strong>${user.created_at.slice(1, 10)}</p>
                            <p><strong>Updated at: </strong>${user.updated_at.slice(1, 10)}</p>`
    })
    .catch((err) => console.log(err))
}

function removeFromFavorite(id) {
  favoriteUsers.splice(favoriteUsers.findIndex(user => user.id === id), 1)
  localStorage.setItem("favoriteUsers", JSON.stringify(favoriteUsers))
  renderUserList(favoriteUsers)
}

