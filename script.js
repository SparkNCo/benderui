GET_URL = "https://us-central1-whatsappbot-438418.cloudfunctions.net/ui_update"
SET_URL = "https://us-central1-whatsappbot-438418.cloudfunctions.net/ui_save"
NAME = 'sofia-test'

const ruleList = document.getElementById('rules');
const toneInput = document.getElementById('tone');
const backstoryInput = document.getElementById('backstory');

function addRule(val = "") {
    console.log("val", val)
    const elem = document.createElement('input');
    console.log(ruleList)
    elem.setAttribute("id", "rule-" + ruleList.children.length);
    elem.setAttribute("type", "text");
    elem.setAttribute("class", "input mt-2");
    elem.setAttribute("placeholder", "What rule should I follow?");
    ruleList.appendChild(elem);
    elem.value = val
}

async function updateUI() {
    try {
        const response = await fetch(`${GET_URL}?name=${encodeURIComponent(NAME)}`, {
            method: 'GET',
        });

        if (response.ok) {
            const data = await response.json();
            backstoryInput.value = data.backstory;
            toneInput.value = data.tone;
            data.rules.forEach(addRule);
        }

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function save() {
    const payload = {
      backstory: backstoryInput.value,
      tone: toneInput.value,
      rules: Array.from(ruleList.querySelectorAll('input')).map(input => input.value).filter((v) => v?.length > 0 )
    };

    try {
      const response = await fetch(SET_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log('Data saved successfully');
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
}

updateUI()

// Updae UI fn
// media = values.media
// mediaContainer.innerHTML = '';
// media.forEach(({url, type = "image"}) => {
//     addMedia(url, type)
// });


// const mediaInput = document.getElementById('media-input');
// const mediaContainer = document.getElementById('media-container');
// let media = []


// async function uploadToGCS(event) {
//     const file = event.target.files[0];
//     const response = await fetch(`${SIGN_URL}?fileName=${file.name}&contentType=${file.type}`);
//     const data = await response.json();

//     await fetch(data.url, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': file.type,
//         },
//         body: file,
//     });

//     addMedia(data.url.split('?')[0], file.type)
//     await save({ text, media })
// }

// function addMedia(url, type) {
//     if (!media.some(m => m.name === url)){
//         media.push({url, type})
//     }

//     const elem = document.createElement(type == 'image' ? 'img' : type);
//     elem.setAttribute("id", url);
//     elem.src = item.url;
//     elem.width = 200;

//     if (type === 'video') {
//         elem.controls = true;
//     }
//     mediaContainer.appendChild(elem);
// }


// function deleteMedia(file) {
//     media = media.filter(({url}) => file.url != url)
//     document.getElementById(file.url).remove()
// }

// mediaInput.addEventListener('change', uploadToGCS);

