import React, { Component } from "react";
import Context from 'library/Context';
import autoBind from 'react-autobind';
import { Scrollbars } from 'react-custom-scrollbars';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ButtonBase from '@material-ui/core/ButtonBase';

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
  play(url) {
    let modal = this.context.app('modal');
    modal.show(<video src={url} style={{ width: '100%' }} autoplay controls></video>);
  }
  render() {
    return (
      <div style={styles.root} className="swing-in-top-fwd" >
        <Scrollbars style={{ height: this.context.state.isMobile ? '52vh' : '81vh' }}  >
          {this.state.videos.map((video, i) =>
            <GridListTile key={i} style={styles.item} >
              <ButtonBase focusRipple onClick={() => this.play(video.link)}>
                <img src={video.image} alt={video.title} style={styles.image} />
                <GridListTileBar title={video.title} />
              </ButtonBase>
            </GridListTile>
          )}
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
  },
  image: {
    borderRadius: 5,
    width: '100%',
    transform: 'translateY(0)'
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