const GET_URL = 'save_url'
const SAVE_URL = 'save_url'
const SIGN_URL = 'save_url'

const textEditor = document.getElementById('text-editor');
const saveTextButton = document.getElementById('save-text');
const imageInput = document.getElementById('image-input');
const videoInput = document.getElementById('video-input');
const imageContainer = document.getElementById('image-container');
const videoContainer = document.getElementById('video-container');

let text = ""
let media = []

async function updateUI(state = null) {
    const response = await fetch(GET_URL);
    values = await response.json();
    media = values.media
    text = values.text
    imageContainer.innerHTML = '';
    videoContainer.innerHTML = '';

    media.forEach(({url, type}) => {
        addMedia(url, type, true)
    });
}

function addMedia(url, type, init = false) {
    if (!init){
        media.push({url, type})
    }

    const elem = document.createElement(type == 'image' ? 'img' : type);
    elem.setAttribute("id", url);
    elem.src = item.url;
    elem.width = 200;

    if (type === 'video') {
        elem.controls = true;
    }
    mediaContainer.appendChild(elem);
}


function deleteMedia(file) {
    media = media.filter(({url}) => file.url != url)
    document.getElementById(file.url).remove()
}

async function save(values) {
    let response = await fetch(SAVE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
    });

    return await response.json();
}

async function uploadToGCS(event) {
    const file = event.target.files[0];
    const response = await fetch(`${SIGN_URL}?fileName=${file.name}&contentType=${file.type}`);
    const data = await response.json();

    await fetch(data.url, {
        method: 'PUT',
        headers: {
            'Content-Type': file.type,
        },
        body: file,
    });

    addMedia(data.url.split('?')[0], file.type)
    await save({ text, media })
}

saveTextButton.addEventListener('click', async () => {
    text = textEditor.textContent
    await save({ text, media })
});

imageInput.addEventListener('change', uploadToGCS);

videoInput.addEventListener('change', uploadToGCS);
