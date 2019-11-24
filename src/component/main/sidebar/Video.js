import React, { Component } from "react";
import Context from 'library/Context';
import autoBind from 'react-autobind';
import { Scrollbars } from 'react-custom-scrollbars';

class Video extends Component {
  static contextType = Context;
  constructor(props) {
    super(props);
    this.state = {
      videos: [],
    };
    autoBind(this);
  }
  componentDidMount() {
    this.context.game.register('videos', this.videos);
    this.context.game.send({ get: 'Videos' });
  }
  videos(videos) {
    this.setState({ videos });
  }
  render() {
    return (
      <div style={styles.root} className="swing-in-top-fwd" >
        <Scrollbars style={{ height: '81vh' }}  >
          {this.state.videos.map((video, i) =>
            <div key={i} style={styles.item} >
              <img src={video.image} style={styles.image} />
              <div style={styles.itemText}>
                {video.title}
              </div>
            </div>
          )
          }
        </Scrollbars>
      </div>
    );
  }
}
const styles = {
  root: {
    flexGrow: 1,
    padding: 15
  },
  item: {
    borderRadius: 5,
    cursor: 'pointer',
    width: '100%',
    position: 'relative',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    opacity: '0.6',
    borderRadius: 5
  },
  itemText: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    textAlign: 'center',
    textShadow: '0 0 3px #333'
  }

}
export default Video;