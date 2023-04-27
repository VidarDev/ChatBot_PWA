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
const inputResetMobile = document.querySelector('#reset-button-mobile')
const inputNotification = document.querySelector('#notification-button')
const inputNotificationMobile = document.querySelector(
    '#button-notification-mobile'
)

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
            const iconNoBell =
                '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.0699 5.12019C10.3731 5.03841 10.6859 4.99805 10.9999 5.00019C12.0608 5.00019 13.0782 5.42161 13.8284 6.17176C14.5785 6.9219 14.9999 7.93932 14.9999 9.00019V10.3402C14.9999 10.6054 15.1053 10.8598 15.2928 11.0473C15.4804 11.2348 15.7347 11.3402 15.9999 11.3402C16.2652 11.3402 16.5195 11.2348 16.707 11.0473C16.8946 10.8598 16.9999 10.6054 16.9999 10.3402V9.00019C16.9985 7.58331 16.4957 6.21265 15.5806 5.13096C14.6654 4.04927 13.397 3.32633 11.9999 3.09019V2.00019C11.9999 1.73497 11.8946 1.48061 11.707 1.29308C11.5195 1.10554 11.2652 1.00019 10.9999 1.00019C10.7347 1.00019 10.4804 1.10554 10.2928 1.29308C10.1053 1.48061 9.99994 1.73497 9.99994 2.00019V3.10019L9.54994 3.18019C9.29268 3.24914 9.07335 3.41747 8.9402 3.64814C8.80705 3.87881 8.77099 4.15293 8.83994 4.41019C8.9089 4.66745 9.07722 4.88678 9.30789 5.01993C9.53856 5.15308 9.81268 5.18914 10.0699 5.12019ZM20.7099 19.2902L2.70994 1.29019C2.52164 1.10188 2.26624 0.996094 1.99994 0.996094C1.73364 0.996094 1.47824 1.10188 1.28994 1.29019C1.10164 1.47849 0.99585 1.73388 0.99585 2.00019C0.99585 2.26649 1.10164 2.52188 1.28994 2.71019L5.40994 6.82019C5.13897 7.51505 4.99993 8.25435 4.99994 9.00019V12.1802C4.41639 12.3865 3.91094 12.7683 3.55288 13.2731C3.19482 13.778 3.00168 14.3812 2.99994 15.0002V17.0002C2.99994 17.2654 3.1053 17.5198 3.29283 17.7073C3.48037 17.8948 3.73472 18.0002 3.99994 18.0002H7.13994C7.37022 18.8476 7.87294 19.5956 8.57054 20.1289C9.26813 20.6622 10.1218 20.9512 10.9999 20.9512C11.878 20.9512 12.7317 20.6622 13.4293 20.1289C14.1269 19.5956 14.6297 18.8476 14.8599 18.0002H16.5899L19.2899 20.7102C19.3829 20.8039 19.4935 20.8783 19.6154 20.9291C19.7372 20.9798 19.8679 21.006 19.9999 21.006C20.132 21.006 20.2627 20.9798 20.3845 20.9291C20.5064 20.8783 20.617 20.8039 20.7099 20.7102C20.8037 20.6172 20.8781 20.5066 20.9288 20.3848C20.9796 20.2629 21.0057 20.1322 21.0057 20.0002C21.0057 19.8682 20.9796 19.7375 20.9288 19.6156C20.8781 19.4937 20.8037 19.3831 20.7099 19.2902ZM6.99994 9.00019C6.98468 8.81717 6.98468 8.6332 6.99994 8.45019L10.5899 12.0002H6.99994V9.00019ZM10.9999 19.0002C10.6509 18.9981 10.3085 18.9047 10.0068 18.7292C9.70503 18.5538 9.45445 18.3025 9.27994 18.0002H12.7199C12.5454 18.3025 12.2949 18.5538 11.9931 18.7292C11.6914 18.9047 11.349 18.9981 10.9999 19.0002ZM4.99994 16.0002V15.0002C4.99994 14.735 5.1053 14.4806 5.29283 14.2931C5.48037 14.1055 5.73472 14.0002 5.99994 14.0002H12.5899L14.5899 16.0002H4.99994Z"/></svg>'
            inputNotification.classList.remove('disabled')
            inputNotificationMobile.removeChild(
                inputNotificationMobile.firstElementChild
            )
            inputNotificationMobile.innerHTML = iconNoBell
        } else {
            const iconBell =
                '<svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 11.18V8C13.9986 6.58312 13.4958 5.21247 12.5806 4.13077C11.6655 3.04908 10.3971 2.32615 9 2.09V1C9 0.734784 8.89464 0.48043 8.70711 0.292893C8.51957 0.105357 8.26522 0 8 0C7.73478 0 7.48043 0.105357 7.29289 0.292893C7.10536 0.48043 7 0.734784 7 1V2.09C5.60294 2.32615 4.33452 3.04908 3.41939 4.13077C2.50425 5.21247 2.00144 6.58312 2 8V11.18C1.41645 11.3863 0.910998 11.7681 0.552938 12.2729C0.194879 12.7778 0.00173951 13.3811 0 14V16C0 16.2652 0.105357 16.5196 0.292893 16.7071C0.48043 16.8946 0.734784 17 1 17H4.14C4.37028 17.8474 4.873 18.5954 5.5706 19.1287C6.26819 19.6621 7.1219 19.951 8 19.951C8.8781 19.951 9.73181 19.6621 10.4294 19.1287C11.127 18.5954 11.6297 17.8474 11.86 17H15C15.2652 17 15.5196 16.8946 15.7071 16.7071C15.8946 16.5196 16 16.2652 16 16V14C15.9983 13.3811 15.8051 12.7778 15.4471 12.2729C15.089 11.7681 14.5835 11.3863 14 11.18ZM4 8C4 6.93913 4.42143 5.92172 5.17157 5.17157C5.92172 4.42143 6.93913 4 8 4C9.06087 4 10.0783 4.42143 10.8284 5.17157C11.5786 5.92172 12 6.93913 12 8V11H4V8ZM8 18C7.65097 17.9979 7.30857 17.9045 7.00683 17.7291C6.70509 17.5536 6.45451 17.3023 6.28 17H9.72C9.54549 17.3023 9.29491 17.5536 8.99317 17.7291C8.69143 17.9045 8.34903 17.9979 8 18ZM14 15H2V14C2 13.7348 2.10536 13.4804 2.29289 13.2929C2.48043 13.1054 2.73478 13 3 13H13C13.2652 13 13.5196 13.1054 13.7071 13.2929C13.8946 13.4804 14 13.7348 14 14V15Z"/></svg>'
            inputNotification.classList.add('disabled')
            inputNotificationMobile.removeChild(
                inputNotificationMobile.firstElementChild
            )
            inputNotificationMobile.innerHTML = iconBell
        }
    }
    // ----------------------------------------------------------------------------
    // Vérification que le navigateur prend en charge les notifications
    if (!('Notification' in window)) {
        alert('This browser does not support notifications.')
    } else {
        Notification.requestPermission((permission) => {
            handlePermission(permission)
            console.log('Notification permission: ' + permission)
        })
    }
}
// ----------------------------------------------------------------------------
//
function resetLocalStorage() {
    const confirmation = confirm(
        'Are you sure, you want to reset localStorage ?'
    )
    if (confirmation) {
        localStorage.clear()
        window.location.reload()
    }
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
inputReset.addEventListener('click', resetLocalStorage)
inputResetMobile.addEventListener('click', resetLocalStorage)
// ----------------------------------------------------------------------------
// Si la permission est "denied", un bouton est présent pour demander la permission
// Si ce bouton est cliqué, alors
inputNotification.addEventListener('click', () => {
    askNotificationPermission()
})
inputNotificationMobile.addEventListener(
    'click',
    () => {
        askNotificationPermission()
        Notification.requestPermission().then((perm) => {
            if (perm === 'granted') {
                new Notification('Bonjour', {
                    body: 'Bienvenue sur le ChatBot :)',
                })
            }
        })
    },
    false
)

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
