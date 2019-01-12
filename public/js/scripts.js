// alert(document.cookie);
JvimData = {};
const videoTitle = document.getElementById('video-title');
const resultsContainer = document.querySelector('#results-container ul');

let options = {
  id: 59777392,
  loop: false
};

const player = new Vimeo.Player('vimeo-slot', options);

player.getVideoTitle().then(function(title) {
    videoTitle.innerText = title;
}).catch(function(error) {
    // an error occurred
});

player.on('timeupdate', (data) => {
  JvimData.position = `${Math.round(data.percent * 100)}`; //store percentage in window object
  JvimData.seconds = data.seconds;
})

player.on('ended', () => {
  alert('The video has ended - thanks for watching!');
});

const setVimeoPosition = (seconds) => {
  player.setCurrentTime(seconds).then( (s) => {

  }).catch( (error) => {
    switch (error.name) {
      case 'RangeError':
        console.error(error);
        break;

      default:
        console.error(error);
        break;
    }
  });
}

//Check for existing time set cookie and set the player to that time
const getCookieSeconds = () => {
  let seconds = 0;
  if ( document.cookie.split(';').filter((item) => item.includes('jVimSeconds=')).length ) {
    seconds = document.cookie.replace(/(?:(?:^|.*;\s*)jVimSeconds\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    seconds = seconds >= 0 ? seconds : 0;
  }

  return seconds;
}

//run setup on window load after iframes are populated
window.addEventListener('load', (e) => {
  let currentVidTime = getCookieSeconds();
  setVimeoPosition(currentVidTime);
});

//Listening for the browser window closing and set cookie 14 expiring in 14 days
window.addEventListener('beforeunload', (e) => {
  e.preventDefault();
  let today = new Date();
  let twoWeeks = new Date(Date.now() + 12096e5);
  twoWeeks = twoWeeks.toUTCString();
  document.cookie = `jVimSeconds=${JvimData.seconds}; expires=${twoWeeks}`;
});


// making API Calls
const getVideoInfo = async (id) => {
  try {
    return await axios.get(`api/videos/${id}`)
  } catch (error) {
    console.error(error)
  }
}

const displayVideoInfo = async (id) => {
  const video = await getVideoInfo(id);

  if (video.data) {
    console.log(video.data);
  }
}

const getSearchedVideos = async () => {
  try {
    return await axios.get(`api/search/skateboard`)
  } catch (error) {
    console.error(error)
  }
}

const displaySearchedVideos = async () => {
  const searchResult = await getSearchedVideos();

  if (searchResult.data) {
    let videos = searchResult.data.data;
    let documentFragment = document.createDocumentFragment();

    for (var i = 0; i < videos.length; i++) {
      console.log(videos[i].name);
      let li = document.createElement('li');
      let textDiv = document.createElement('div');
      let title = document.createElement('h3');
      title.innerText = videos[i].name;

      textDiv.appendChild(title);
      li.appendChild(textDiv);
      documentFragment.appendChild(li);
    }

    resultsContainer.appendChild(documentFragment);
  }
}


// make inital call
displayVideoInfo('59777392');
displaySearchedVideos();
