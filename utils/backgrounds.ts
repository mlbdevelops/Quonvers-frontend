export const Backgrounds = {
  'bg_default': require('../assets/chat_bgs/15.jpg'),
  'bg_1': require('../assets/chat_bgs/2.jpg'),
  'bg_2': require('../assets/chat_bgs/3.jpg'),
  'bg_3': require('../assets/chat_bgs/4.jpg'),
  'bg_4': require('../assets/chat_bgs/5.jpeg'),
  'bg_5': require('../assets/chat_bgs/6.jpeg'),
  'bg_6': require('../assets/chat_bgs/7.jpeg'),
  'bg_7': require('../assets/chat_bgs/8.jpg'),
  'bg_8': require('../assets/chat_bgs/9.jpeg'),
  'bg_9': require('../assets/chat_bgs/10.jpeg'),
  'bg_10': require('../assets/chat_bgs/11.jpeg'),
  'bg_11': require('../assets/chat_bgs/12.jpg'),
  'bg_12': require('../assets/chat_bgs/13.jpg'),
  'bg_13': require('../assets/chat_bgs/14.jpg'),
  'bg_14': require('../assets/chat_bgs/17.jpeg'),
}

export const ArrayBackgrounds = [
  {name: 'photo_upload', path: null, not_wall: true},
  {name: 'bg_default', path: require('../assets/chat_bgs/15.jpg')},
  {name: 'bg_1', path: require('../assets/chat_bgs/2.jpg')},
  {name: 'bg_2', path: require('../assets/chat_bgs/3.jpg')},
  {name: 'bg_3', path: require('../assets/chat_bgs/4.jpg')},
  {name: 'bg_4', path: require('../assets/chat_bgs/5.jpeg')},
  {name: 'bg_5', path: require('../assets/chat_bgs/6.jpeg')},
  {name: 'bg_6', path: require('../assets/chat_bgs/7.jpeg')},
  {name: 'bg_7', path: require('../assets/chat_bgs/8.jpg')},
  {name: 'bg_8', path: require('../assets/chat_bgs/9.jpeg')},
  {name: 'bg_9', path: require('../assets/chat_bgs/10.jpeg')},
  {name: 'bg_10', path: require('../assets/chat_bgs/11.jpeg')},
  {name: 'bg_11', path: require('../assets/chat_bgs/12.jpg')},
  {name: 'bg_12', path: require('../assets/chat_bgs/13.jpg')},
  {name: 'bg_13', path: require('../assets/chat_bgs/14.jpg')},
  {name: 'bg_14', path: require('../assets/chat_bgs/17.jpeg')},
]

export const backgroundImage = (bg_uri) => {
  if(!bg_uri) return Backgrounds['bg_default']
  const img = Backgrounds[bg_uri]
  if (img) return img
  return { uri: bg_uri } 
}