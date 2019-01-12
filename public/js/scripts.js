console.log('connected');
window.jVimData = {};

let options = {
  id: 59777392,
  width: 460,
  loop: false
};

const player = new Vimeo.Player('vimeo-slot', options);

player.on('play', () => {
  console.log('video playing');
});

player.on('pause', () => {
  console.log('paused');
});

player.on('timeupdate', (data) => {
  let percent = `${Math.round(data.percent * 100)}`;
  jVimData.position = percent; //store percentage in window object
  console.log(percent);
})

player.on('ended', () => {
  console.log('video ended');
});


//Listening for the browser window closing
window.addEventListener('beforeunload', (e) => {
  e.preventDefault();
  document.cookie = `jVimValue=${jVimData.position}`;
});

//Check for existing cookie
if ( document.cookie.split(';').filter((item) => item.includes('jVimValue=')).length ) {
  // var cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)testing\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  alert(document.cookie);
}
