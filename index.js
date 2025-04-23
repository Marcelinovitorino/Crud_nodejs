const express = require('express')
const { v4: uuidv4 } = require('uuid')

const app = express()

app.use(express.json())

// Armazenamento dos usuários em um array (em memória, sem banco de dados)
const Users = []

// Rota GET - Lista todos os usuários, com opção de filtro por nome via query params
app.get("/users", (req, res) => {
    const { nome } = req.query 

    // Se 'nome' for fornecido, filtra os usuários que contenham esse nome caso nao lista todos usuarios
    const results = nome
        ? Users.filter(user => user.nome.includes(nome))
        : Users

    return res.json(results)
})

// Rota POST - Cria um novo usuário
app.post("/users", (req, res) => {
    const id = uuidv4() // Gera ID único
    const { nome, email, senha } = req.body 

    const User = {
        id,
        nome,
        email,
        senha
    }

    Users.push(User) 
    return res.json(Users)
})

// Rota PUT - Atualiza os dados de um usuário existente
app.put("/users/:id", (req, res) => {
    const { id } = req.params
    const { nome, email, senha } = req.body

    const UserIndex = Users.findIndex(user => user.id == id)

    if (UserIndex < 0) {
        return res.status(404).json({ error: "User not found!" })
    }

    const User = {
        id,
        nome,
        email,
        senha
    }

    Users[UserIndex] = User
    return res.json(Users)
})

// Rota DELETE - Remove um usuário com base no ID
app.delete("/users/:id", (req, res) => {
    const { id } = req.params

    const UserIndex = Users.findIndex(user => user.id == id)

    if (UserIndex < 0) {
        return res.status(404).json({ error: "User not found!" })
    }

    Users.splice(UserIndex, 1) 
    return res.status(200).json([])
})

// Inicializa o servidor na porta 4000
const PORT = 4000
app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`)
})
