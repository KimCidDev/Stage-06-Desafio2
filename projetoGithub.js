import { ImportUserGithub } from '/githubfavorites.js'

// Classe para conter a lógica dos dados
export class FavoritosGithubDados {
  constructor(conteiner) {
    this.extracao = document.querySelector(conteiner)
    this.load()

    ImportUserGithub.search('kimciddev').then(user => console.log(user))

    this.addUser = this.extracao.querySelector('table tbody')
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async addInputData(username) {
    try {
      const userExists = this.entries.find(entry => entry.login === username)

      if (userExists) {
        throw new Error('usuário já cadastrado')
      }

      const user = await ImportUserGithub.search(username)

      if (user.login === undefined) {
        throw new Error('teu cu')
      }
      this.entries = [user, ...this.entries]
      this.update()
      this.save()
    } catch (error) {
      alert(error.message)
    }
  }

  delete(user) {
    // Higher order function (Filter, Map, Find, Reduce)
    const afterDelete = this.entries.filter(entry => entry.login !== user.login)

    this.entries = afterDelete
    console.log(afterDelete)
    this.update()
    this.save()
  }
}

// Classe para eventos e modificações do HTML
export class FavoritosGithubVisual extends FavoritosGithubDados {
  constructor(replicacaoExtracaoConteiner) {
    super(replicacaoExtracaoConteiner)
    console.log(this.extracao)
    this.update()
    this.addInput()
  }

  addInput() {
    const searchUserButton = this.extracao.querySelector('#searchUser')

    searchUserButton.onclick = () => {
      const { value } = this.extracao.querySelector('#search-input')

      console.log(value)

      this.addInputData(value)
    }
  }

  update() {
    this.removeAllTr()

    this.entries.forEach(entry => {
      console.log(entry)

      const row = this.createRow()

      row.querySelector(
        '.userInfo img'
      ).src = `https://github.com/${entry.login}.png`
      row.querySelector(
        '.userInfo a'
      ).href = `https://github.com/${entry.login}`
      row.querySelector('.userInfo a p').textContent = entry.name
      row.querySelector('.userInfo a span').textContent = entry.login
      row.querySelector('.repositories').textContent = entry.public_repos
      row.querySelector('.followers').textContent = entry.followers

      row.querySelector('#removeButton').onclick = () => {
        const isOk = confirm('Estás certo disso?')
        if (isOk) {
          this.delete(entry)
        }
      }

      this.addUser.append(row)

      return row
    })
  }

  removeAllTr() {
    console.log(typeof this.addUser)

    this.addUser.querySelectorAll('tr').forEach(usuario => {
      usuario.remove()
    })
  }

  createRow() {
    const userInfo = `<td class="userInfo">
    <img
      src="https://github.com/maykbrito.png"
      alt="Mayk Brito's profile image"
    />
    <a href="https://github.com/maykbrito" target="_blank">
      <p>Maykk Brito</p>
      <span>maykbrito</span>
    </a>
  </td> 
  <td class="repositories">10</td>
  <td class="followers">123</td>
  <td id="removeButton">&times;</td>`

    const newUser = document.createElement('tr')
    newUser.innerHTML = userInfo

    console.log(newUser)

    return newUser
  }
}
