
const api_url = 'https://api.github.com/users/';

const form = document.getElementById('form');
const search = document.getElementById('search');
const main = document.getElementById('main');

async function getUser(username) {
    try {
        // const {data} = await axios.get(api_url + username)  
        const res = await axios.get(api_url + username) 
        // console.log(res.data);
        createCard(res.data);
        getRepos(username);
    }
    catch(error) {
        // console.log(error)
        if(error.response.status === 404) {
            createErrorCard('No profile with that User name.');
        }
    }   
}

// Using .then()
// function getUser(username) {
//     axios.get(api_url + username) 
//         .then(res => console.log(res.data))
//         .catch(err => console.log(err))
// }

async function getRepos(username) {
    try {
        const res = await axios.get(api_url + username + '/repos?sort=created') 
        addRepos(res.data);
    }
    catch(error) {
        createErrorCard('Problem Fetching Repos');
    }
}

function addRepos(repos) {
    const reposEle = document.getElementById('repos');
    repos
        .slice(0, 5)
        .forEach(repo => {
            const ele = document.createElement('a');
            ele.classList.add('repo');
            ele.href = repo.html_url;
            // When user clicks the repo it opens in new window 
            ele.target = '_blank';
            ele.innerText = repo.name;
            reposEle.appendChild(ele);
    })
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const user = search.value;

    if(user) {
        getUser(user)
        search.value = '';
    }
})

function createCard(user) {
    const userID = user.name || user.login;
    // If the bio was empty
    const userBio = user.bio ? `<p>${user.bio}</p>` : '';
    const userHtml = `
    <div class="card">
    <div>
      <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
    </div>
    <div class="user-info">
      <h2>${userID}</h2>
      ${userBio}

      <ul>
        <li>${user.followers} <strong>Followers</strong></li>
        <li>${user.following} <strong>Following</strong></li>
        <li>${user.public_repos} <strong>Repos</strong></li>
      </ul>

      <div id="repos"></div>
    </div>
    </div>
  `
    main.innerHTML = userHtml;
}

function createErrorCard(msg) {
    const cardHtml = `
        <div class="card">
            <h1>${msg}</h1>
        </div>
    `
    main.innerHTML = cardHtml;
}


