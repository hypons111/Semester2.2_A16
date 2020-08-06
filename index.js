const BASE_URL = 'https://lighthouse-user-api.herokuapp.com/api/v1/users/'
const showMode = document.querySelector(".navbar-showMode")
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")
const genderDropdownList = document.getElementById("genderDropdownList")
const regionDropdownList = document.getElementById("regionDropdownList")
const showHowManyUsersPerPageDropdownList = document.getElementById("showHowManyUsersPerPageDropdownList")
const numberOfUser = document.getElementById("numberOfUser")
const dataPanel = document.querySelector("#data-panel")
const userName = document.querySelector("#user-modal-name")
const userAvatar = document.querySelector("#user-modal-avatar")
const userInfo = document.querySelector("#user-modal-info")
const paginator = document.querySelector("#paginator")


const model = {
  users: [],
  filteredUser: [],
  viewMode: "card",
  currentPage: 1,
  currentGender: "",
  currentRegion: "",
  userPerPage: 12,
  favoriteList: JSON.parse(localStorage.getItem("favoriteUsers")) || [],
  userRegion: [],
  // 全名轉簡寫、簡寫轉全名
  switchRegionName(region) {
    switch (region) {
      case "CH": return "Switzerland"
      case "AU": return "Australia"
      case "CA": return "Canada"
      case "DE": return "Germany"
      case "BR": return "Brazil"
      case "US": return "United States of America"
      case "NO": return "Norway"
      case "TR": return "Turkey"
      case "ES": return "Spain"
      case "FI": return "Finland"
      case "NZ": return "New Zealand"
      case "DK": return "Denmark"
      case "NL": return "Finland"
      case "IR": return "Iran"
      case "IE": return "Ireland"
      case "GB": return "United Kiongdom"
      case "FR": return "France"
      case "Switzerland": return "CH"
      case "Australia": return "AU"
      case "Canada": return "CA"
      case "Germany": return "DE"
      case "Brazil": return "BR"
      case "United States of America": return "US"
      case "Norway": return "NO"
      case "Turkey": return "TR"
      case "Spain": return "ES"
      case "Finland": return "FI"
      case "New Zealand": return "NZ"
      case "Denmark": return "DK"
      case "Finland": return "NL"
      case "Iran": return "IR"
      case "Ireland": return "IE"
      case "United Kiongdom": return "GB"
      case "France": return "FR"
    }
  },
}

const view = {
  renderCardViewMode(data) {
    let tempHTML = ""
    data.forEach(user => {
      tempHTML +=
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
              <button class="btn btn-info btn-add-favorite" data-id="${user.id}">+</button>
            </div>
          </div>
        </div>
      </div>`
    })
    dataPanel.innerHTML = tempHTML
  },

  renderListViewMode(data) {
    let tempHTML = ""
    data.forEach(user => {
      tempHTML +=
        `<div class="container">
          <nav id="navbar-example2" class="navbar navbar-light bg-light">
            <a class="navbar-brand">${user.name} ${user.surname}</a>
            <ul class="nav nav-pills">
              <li class="nav-item">
                <button class="btn btn-primary btn-show-user" data-toggle="modal" data-target="#user-modal" data-id="${user.id}">More</button>
              </li>
              <li class="nav-item">
                <button class="btn btn-info btn-add-favorite" data-id="${user.id}">+</button>
              </li>
            </ul>
          </nav>
        </div>`
    })
    dataPanel.innerHTML = tempHTML
  },

  renderRegionDropdownList(data) {
    // 篩選掉重覆的 region
    data.forEach(data => {
      if (!model.userRegion.find(region => region === model.switchRegionName(data.region))) {
        model.userRegion.push(model.switchRegionName(data.region))
      }
    })
    // 順序
    model.userRegion.sort()
    // 放到 region dropdown list
    model.userRegion.forEach(region => {
      regionDropdownList.innerHTML += `<a class="dropdown-item" data-id="${model.switchRegionName(region)}" href="#">${region}</a>`
    })
  },

  renderUserModel(id) {
    axios.get(BASE_URL + id)
      .then(response => {
        const user = response.data
        userName.innerText = `${user.name} ${user.surname}`
        userAvatar.innerHTML = `<img src="${user.avatar}" class="h-100 d-inline-block">`
        let region = model.switchRegionName(user.region)
        userInfo.innerHTML =
          `<p><strong>Age: </strong>${user.age}</p>
          <p><strong>Email: </strong>${user.email}</p>
          <p><strong>Gender: </strong>${user.gender}</p>
          <p><strong>Region: </strong>${region}</p>
          <p><strong>Birthday: </strong>${user.birthday}</p>
          <p><strong>Created at: </strong>${user.created_at.slice(1, 10)}</p>
          <p><strong>Updated at: </strong>${user.updated_at.slice(1, 10)}</p>`
      })
      .catch((err) => console.log(err))
  },

  renderPaginator(amount) {
    const numberOfPages = Math.ceil(amount / model.userPerPage)
    let tempHTML = ''
    for (let page = 1; page <= numberOfPages; page++) {
      tempHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
    }
    paginator.innerHTML = tempHTML
  },

  renderGenderList(targetGender) {
    const genderButton = document.getElementById("genderButton")
    switch (targetGender) {
      case "Male":
        genderButton.classList = "btn btn-primary dropdown-toggle mb-2 mr-sm-2"
        break
      case "Female":
        genderButton.classList = "btn btn-danger dropdown-toggle mb-2 mr-sm-2"
        break
      default:
        genderButton.classList = "btn btn-success dropdown-toggle mb-2 mr-sm-2"
        break
    }
    genderButton.innerHTML = targetGender
  },

  createRemoveFilterButton() {
    if (document.getElementById("Remove-filter-button")) return
    const div = document.createElement("div")
    div.innerHTML =
      `<button type="button" class="btn btn-dark mb-2 mr-sm-2 col-12" id="Remove-filter-button" id="resetSeacrchButton">Clear Search Filter</button>`
    document.querySelector("#search-bar").after(div)
  },

  resetSeachButtons() {
    view.renderGenderList("All Gender")
    document.getElementById("regionButton").innerHTML = "All Region"
  }
}

const controller = {
  initialize() {
    axios
      .get(BASE_URL)
      .then((response) => {
        model.users.push(...response.data.results)
        view.renderCardViewMode(controller.getUsersByPage(1))
        view.renderRegionDropdownList(model.users)
        view.renderPaginator(model.users.length)
      })
      .catch((err) => console.log(err))

    // 檢視模式
    showMode.addEventListener("click", function onShowModeButtonClicked(evnet) {
      model.viewMode = evnet.target.id
      controller.viewModeRouter(model.currentPage)
    })
    // 名字搜尋
    searchForm.addEventListener("submit", function onSearchFormSubmitted() {
      event.preventDefault()
      controller.searchByName()
    })
    // 性別搜尋
    genderDropdownList.addEventListener("click", function onGenderChoose() {
      view.renderGenderList(event.target.innerHTML)
      controller.searchByGenderAndRegion(event.target.id, model.currentRegion)
    })
    // 地區搜尋
    regionDropdownList.addEventListener("click", function onRegionChoose() {
      document.getElementById("regionButton").innerHTML = event.target.innerText
      controller.searchByGenderAndRegion(model.currentGender, event.target.dataset.id)
    })
    // 更換每頁資料數量
    showHowManyUsersPerPageDropdownList.addEventListener("click", function onNumberOfUserPerPageChoose() {
      if (event.target.matches(".dropdown-Item")) {
        document.getElementById("numberOfUser").innerHTML = event.target.id
        model.userPerPage = Number(event.target.id)
        model.currentPage = 1
        controller.viewModeRouter(model.currentPage)
        view.renderPaginator(model.users.length)
      }
    })
    // 詳細資料、Favorite 
    dataPanel.addEventListener("click", function onPanelClicked(event) {
      if (event.target.matches('.btn-show-user')) {
        userName.innerText = ``
        userAvatar.innerHTML = ``
        userInfo.innerHTML = ``
        view.renderUserModel(event.target.dataset.id)
      } else if (event.target.matches('.btn-add-favorite')) {
        controller.addToFavorite(Number(event.target.dataset.id))
      }
    })
    // 分頁
    paginator.addEventListener('click', function onPaginatorClicked(event) {
      if (event.target.tagName !== 'A') return
      model.currentPage = Number(event.target.dataset.page)
      controller.viewModeRouter(model.currentPage)
    })
  },

  viewModeRouter(page) {
    if (model.viewMode === "card") {
      view.renderCardViewMode(controller.getUsersByPage(page || 1))
    } else {
      view.renderListViewMode(controller.getUsersByPage(page || 1))
    }
  },

  getUsersByPage(page) {
    const data = model.filteredUser.length ? model.filteredUser : model.users
    const startIndex = (page - 1) * model.userPerPage
    return data.slice(startIndex, startIndex + model.userPerPage)
  },

  addToFavorite(id) {
    const user = model.users.find(user => user.id === id)
    if (model.favoriteList.some(user => user.id === id)) return alert('已經在收藏清單中')
    model.favoriteList.push(user)
    localStorage.setItem("favoriteUsers", JSON.stringify(model.favoriteList))
  },

  searchByName() {
    model.filteredUser = []
    if (!searchInput.value.length) alert("請輸入有效字串")
    let userName = model.users.filter(user => user.name.toLowerCase().includes(searchInput.value.trim().toLowerCase()))
    let userSurName = model.users.filter(user => user.surname.toLowerCase().includes(searchInput.value.trim().toLowerCase()))
    model.filteredUser.push(...userName, ...userSurName)
    if (model.filteredUser.length === 0) return alert(`沒有符合條件的名字`)
    view.renderPaginator(model.filteredUser.length)
    controller.viewModeRouter(model.currentPage)
  },

  searchByGenderAndRegion(targetGender, targetRegion) {
    // 如果性別搜尋條件不存在
    let tempGenderFilteredUser = model.users

    // 如果性別搜尋條件存在或有更改
    if (model.currentGender !== targetGender || model.currentGender !== "") {
      tempGenderFilteredUser = model.users.filter(user => user.gender === targetGender)
      model.currentGender = targetGender
    }

    // 如果國家搜尋條件不存在
    let tempRegionFilteredUser = tempGenderFilteredUser

    // 如果國家搜尋條件存在或有更改
    if (model.currentRegion !== targetRegion || model.currentRegion !== "") {
      tempRegionFilteredUser = tempGenderFilteredUser.filter(user => user.region === targetRegion)
      model.currentRegion = targetRegion
    }

    model.filteredUser = tempRegionFilteredUser

    view.renderPaginator(model.filteredUser.length)
    controller.viewModeRouter(1)
    view.createRemoveFilterButton()
    controller.setEventListenerOnRemoveFilterButton()
  },

  setEventListenerOnRemoveFilterButton() {
    const removeFilterButton = document.getElementById("Remove-filter-button")
    removeFilterButton.addEventListener("click", function onRemoveFilterButtonClick() {
      removeFilterButton.remove()
      view.resetSeachButtons()
      model.filteredUser = []
      model.currentPage = 1
      model.currentGender = ""
      model.currentRegion = ""
      view.renderCardViewMode(controller.getUsersByPage(1))
      view.renderRegionDropdownList(model.users)
      view.renderPaginator(model.users.length)
    })
  }
}




controller.initialize()



