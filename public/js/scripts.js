console.log('connected');

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


player.on('ended', () => {
  console.log('video ended');
});

player.on('timeupdate', (data) => {
  let percent = `${Math.round(data.percent * 100)}%`;
  console.log(percent);
})
