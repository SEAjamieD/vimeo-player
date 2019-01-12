// alert(document.cookie);
JvimData = {};
const videoTitle = document.getElementById('video-title');

let options = {
  id: 59777392,
  loop: false
};

const player = new Vimeo.Player('vimeo-slot', options);

player.getVideoTitle().then(function(title) {
    // title = the title of the video
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



// calling the api
axios({
  url: 'localhost:5000/api/video-info',
  method: 'get',
  data: {
    foo: 'bar'
  }
})
