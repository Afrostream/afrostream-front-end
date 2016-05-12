function newOne (style) {
  return mountNode => {
    return {
      position: 'absolute',
      width: '10px',
      height: '10px',
      right: 0,
      top: 0,
      borderRadius: '50%',
      animation: 'glow 1s ease-out',
      WebkitAnimation: 'glow 1s ease-out',
      MozAnimation: 'glow 1s ease-out',
      background: 'black',
      border: '2px solid white',
      cursor: 'pointer',
      content: 'nouveau',
      ...style
    };
  };
}

const indicatorStyle = newOne();
indicatorStyle.overwrite = newOne;
export default indicatorStyle;
