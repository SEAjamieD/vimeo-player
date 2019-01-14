
JvimData = {};


const videoTitle = document.getElementById('video-title');
const videoDescription = document.getElementById('video-description');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.querySelector('#results-container ul');

// utility
// david walsh debounce - https://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

// set cookies
const setCookie = (name, value) => {
	let today = new Date();
	let twoWeeks = new Date(Date.now() + 12096e5);
	twoWeeks = twoWeeks.toUTCString();
	document.cookie = `${name}=${value}; expires=${twoWeeks};`
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

//Check for existing video id set cookie and set the player to that video
const getCookieVideo = () => {
  let video = 59777392;
  if ( document.cookie.split(';').filter((item) => item.includes('jVimVideo=')).length ) {
    video = document.cookie.replace(/(?:(?:^|.*;\s*)jVimVideo\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (video !== 'undefined') {
      video = video;

    } else {
      video = 59777392;
    }
  }

  return video;
}

JvimData.seconds = getCookieSeconds();
JvimData.video = getCookieVideo();

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

// make inital call
let options = {
  id: getCookieVideo(),
  loop: false
};

const loadPlayer = async (options) => {

	const video = await getVideoInfo(options.id);
	JvimData.video = options.id;
	setCookie('jVimVideo', JvimData.video);
		if (video.data) {
			videoTitle.innerText = video.data.name;
			videoDescription.innerText = video.data.description;

			//update video to cookie time if exists
			let currentVidTime = getCookieSeconds();
			setVimeoPosition(currentVidTime);

		} else {
			// handle error
		}
}



//Listening for the browser window closing and set cookie 14 expiring in 14 days
window.addEventListener('beforeunload', (e) => {
  e.preventDefault();
	setCookie('jVimVideo', JvimData.video);
	setCookie('jVimSeconds', JvimData.seconds);
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
		JvimData.video = id;
		setCookie('jVimVideo', JvimData.video);

    player.loadVideo(id).then(function(id) {
      videoTitle.innerText = video.data.name;
      videoDescription.innerText = video.data.description;

    }).catch(function(error) {
      switch(error.name) {
          case 'TypeError':
            console.error(error);
            break;

          case 'Password Error':
            console.error(error);
            break;

          case 'PrivacyError':
            // the video is password-protected or private
            console.error(error);
            break;

          default:
            // some other error occurred
            console.error(error);
            break;
      }
    });

  }
}

const getSearchedVideos = async (query) => {
  try {
    return await axios.get(`api/search/${query}`)
  } catch (error) {
    console.error(error)
  }
}

const displaySearchedVideos = async (query) => {
  const searchResult = await getSearchedVideos(query);

  if (searchResult.data) {
    let videos = searchResult.data.data;
    let documentFragment = document.createDocumentFragment();
    resultsContainer.innerHTML = "";

    for (var i = 0; i < videos.length; i++) {

      let li = document.createElement('li');
      let textDiv = document.createElement('div');
			textDiv.setAttribute('class', 'title-container');

      let title = document.createElement('h3');
      title.innerText = videos[i].name;
			textDiv.appendChild(title);

			let videoId = (videos[i].uri).split('/');
			videoId = videoId[videoId.length-1]
			li.dataset.videoId = videoId;

			let imgContainer = document.createElement('div');
			imgContainer.setAttribute('class', 'video-thumb');

			let img = new Image();
			img.src = `https://i.vimeocdn.com/video/${videoId}_100x75.jpg?r=pad`;
			imgContainer.appendChild(img);

			li.appendChild(imgContainer);
      li.appendChild(textDiv);

      li.addEventListener('click', handleVideoClick);
      documentFragment.appendChild(li);
    }

    resultsContainer.appendChild(documentFragment);
  }
}


// resond to search
const handleSearch = (e) => {
  if (e.target.value.length > 0) {
    displaySearchedVideos(e.target.value);
  }
}

const debouncedSearch = debounce( (e) => {
  handleSearch(e);
}, 300);

//handle click on search result
const handleVideoClick = (e) => {
  let videoId = e.target.closest('li').dataset.videoId;
	//reset cookie time on new video
	JvimData.seconds = 0;
	setCookie('jVimSeconds', JvimData.seconds);

	deactivateSearch();
  displayVideoInfo(videoId);
}


// search bar activation
const activateSearch = () => {
	searchInput.classList.toggle('active');
	searchInput.focus();
}

const deactivateSearch = () => {
	searchInput.classList.remove('active');
	searchInput.value = "";
	searchInput.blur();
}

const toggleSearch = () => {
	searchInput.classList.contains('active')
		? deactivateSearch()
		: activateSearch();
}

const searchButton = document.querySelector('.fa-search');
searchButton.addEventListener('click', toggleSearch);
searchInput.addEventListener('keyup', (e) => debouncedSearch(e) );


// run iniital setup on window load after iframes are populated
const player = new Vimeo.Player('vimeo-slot', options);
window.addEventListener('load', (e) => {
	loadPlayer(options);
  displaySearchedVideos('seattle')
});


// update global object for seconds watched
player.on('timeupdate', (data) => {
  JvimData.position = `${Math.round(data.percent * 100)}`; //store percentage in window object
  JvimData.seconds = data.seconds;
})

player.on('ended', () => {
  alert('The video has ended - thanks for watching!');
});
