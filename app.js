// ============================================================================
// App.js
// ============================================================================
// ============================================================================
// Constants

// ----------------------------------------------------------------------------
// Récupèration les éléments Input du DOM
const inputMessage = document.querySelector('#message-input')
const inputSubmit = document.querySelector('#submit-button')
const inputReset = document.querySelector('#reset-button')
const inputNotification = document.querySelector('#notification-button')

// ----------------------------------------------------------------------------
// Récupèration des autres éléments du DOM
const sectionMessages = document.querySelector('#messages')
const formChat = document.querySelector('#chat-form')
// ============================================================================
// Functions

// ----------------------------------------------------------------------------
// Charger les questions à partir de questions.json
async function loadQuestions() {
    const response = await fetch('./questions.json')
    const data = await response.json()
    return data.questions
}

let questions = []

loadQuestions().then((data) => {
    questions = data
})
// ----------------------------------------------------------------------------
// Défini une fonction pour ajouter un message à la liste
function addMessage({ author, content, date }) {
    const messageDiv = document.createElement('div')
    messageDiv.classList.add(
        author === 'Bot' ? 'bot-message-container' : 'user-message-container'
    )
    messageDiv.innerHTML = `<span class="user">${author}</span>
         <div class="chat-bubble">
             <span class="content">${content}</span>
             <span class="date">${date}</span>
         </div>`
    sectionMessages.appendChild(messageDiv)
    sectionMessages.scrollTo({
        top: sectionMessages.scrollHeight,
        behavior: 'smooth',
    })
}
// ----------------------------------------------------------------------------
// Vérifie la permission de notification
function askNotificationPermission() {
    // ----------------------------------------------------------------------------
    // La fonction vérifie la permission
    function handlePermission(permission) {
        // ----------------------------------------------------------------------------
        // Affichage ou non le bouton en fonction de la réponse
        if (
            Notification.permission === 'denied' ||
            Notification.permission === 'default'
        ) {
            inputNotification.classList.remove('disabled')
        } else {
            inputNotification.classList.add('disabled')
        }
    }
    // ----------------------------------------------------------------------------
    // Vérification que le navigateur prend en charge les notifications
    if (!('Notification' in window)) {
        alert('This browser does not support notifications.')
    } else {
        if (checkNotificationPromise()) {
            // ----------------------------------------------------------------------------
            // Fonction qui demande la permission
            Notification.requestPermission().then((permission) => {
                handlePermission(permission)
                console.log('Notification permission: ' + permission)
            })
            // ----------------------------------------------------------------------------
        } else {
            Notification.requestPermission((permission) => {
                handlePermission(permission)
                console.log('Notification permission: ' + permission)
            })
        }
    }
}
// ----------------------------------------------------------------------------
// Fonction qui demande la permission
function checkNotificationPromise() {
    try {
        Notification.requestPermission().then()
    } catch (e) {
        return false
    }

    return true
}
// ----------------------------------------------------------------------------
// Ajoutez cette fonction pour envoyer un message du bot
function sendMessageBot() {
    // Définit l'auteur comme étant le Bot ou l'autre utilisateur
    const messageAuthor = 'Bot'

    // Génère un chiffre aléatoire qui correspond à la question
    const randomIndex = Math.floor(Math.random() * questions.length)
    const messageContent = questions[randomIndex]

    // Creation de la date actuelle
    const date = new Date()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    // Return seulement les heures et les minutes
    const messageDate = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}`

    const message = {
        author: messageAuthor,
        content: messageContent,
        date: messageDate,
    }

    setTimeout(() => {
        addMessage(message)
    }, 1000)

    localStorage.setItem(Date.now().toString(), JSON.stringify(message))
}

// On définit une fonction pour envoyer le message
function sendMessageUser(event) {
    event.preventDefault()

    // Définit l'auteur comme étant l'utilisateur
    const messageAuthor = 'You'
    // Prend la valeur saisi dans le input de message
    const messageContent = inputMessage.value

    // Creation de la date actuelle
    const date = new Date()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    // Return seulement les heures et les minutes
    const messageDate = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}`

    // ----------------------------------------------------------------------------
    // Remove les whitespace des extremités du message
    if (!messageContent.trim()) {
        return
    }
    // ----------------------------------------------------------------------------
    // Insertion les consts dans un tableau
    const message = {
        author: messageAuthor,
        content: messageContent,
        date: messageDate,
    }

    // Envoie le message
    addMessage(message)
    // Reset la valeur de l'input du message
    inputMessage.value = ''
    // Envoie le message dans le localStorage
    localStorage.setItem(Date.now().toString(), JSON.stringify(message))

    // Demande une réponse au bot
    setTimeout(() => {
        sendMessageBot()
    }, 1000)
}

// ============================================================================
// AddEventListener
// ----------------------------------------------------------------------------
// Ajout d'un listener sur le bouton d'envoi du message
if (formChat) {
    formChat.addEventListener('submit', sendMessageUser)
}
// ----------------------------------------------------------------------------
// Afficher les messages du LocalStorage

// Const pour connaitre l'ordre de création
const sortedKeys = Object.keys(localStorage)
    .filter((key) => /^\d+$/.test(key))
    .sort((a, b) => parseInt(a) - parseInt(b))

// Afficher les messages du localStorage dans l'ordre de création
sortedKeys.forEach((messageKey) => {
    const messageData = localStorage.getItem(messageKey)
    const message = JSON.parse(messageData)
    addMessage(message)
})
// ----------------------------------------------------------------------------
// Ajout d'un listener sur l'événement "storage" pour rafraîchir les messages en temps réel
window.addEventListener('storage', (event) => {
    if (event.key !== null && /^\d+$/.test(event.key)) {
        const messageData = localStorage.getItem(event.key)
        if (event.oldValue === null) {
            const message = JSON.parse(messageData)
            addMessage(message)
        }
    }
})
// ----------------------------------------------------------------------------
// Si le Input de saisi de messages est (keypress == Entrer), alors
if (inputMessage) {
    inputMessage.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            // Déclenche le submit button
            inputSubmit.click()
        }
    })
}
// ----------------------------------------------------------------------------
// Création d'un bouton pour réinitialiser le Local Storage
// Si ce bouton est cliqué, alors
inputReset.addEventListener('click', () => {
    const confirmation = confirm(
        'Are you sure, you want to reset localStorage ?'
    )
    if (confirmation) {
        localStorage.clear()
        window.location.reload()
    }
})
// ----------------------------------------------------------------------------
// Si la permission est "denied", un bouton est présent pour demander la permission
// Si ce bouton est cliqué, alors
inputNotification.addEventListener('click', () => {
    checkNotificationPromise()
    askNotificationPermission()
})

// ============================================================================
// Lance la fonction une fois la page entièrement chargée
window.addEventListener('load', () => {
    // ----------------------------------------------------------------------------
    // Installation d'un Service worker pour PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./sw.js')
            .then((registration) => {
                console.log('Success Service worker:', registration.scope)
            })
            .catch((error) => {
                console.log('Error Service worker:', error)
            })
    }
    // ----------------------------------------------------------------------------
    // Vérifie la permission de notification
    askNotificationPermission()
})
// ============================================================================
