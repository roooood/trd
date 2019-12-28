import React, { Component } from "react";
import Context from 'library/Context';
import autoBind from 'react-autobind';
import { Scrollbars } from 'react-custom-scrollbars';
import { t } from 'locales';
import Typography from '@material-ui/core/Typography';

class LeadBoard extends Component {
  static contextType = Context;
  constructor(props) {
    super(props);
    this.state = {
      leads: [],
    };
    autoBind(this);
  }
  componentDidMount() {
    this.context.game.register('leads', this.leads);
    this.context.game.send({ get: 'Leads' });
  }
  leads(leads) {
    this.setState({ leads });
  }
  render() {
    return (
      <div style={styles.root} className="swing-in-top-fwd" >
        <Typography align="center" gutterBottom > {t('leaderBoard')}</Typography >
        <Scrollbars style={{ height: this.context.state.isPortrait ? '85vh' :this.context.state.isMobile ? '67vh' : '77vh' }}  >
          {this.state.leads.map((lead, i) => {
            return (<div key={i} style={styles.item}>
              <div style={{ ...styles.subItem, color: 'rgb(247, 183, 28)', fontWeight: 'bold' }}>
                {i + 1}
              </div>
              <div style={styles.subItem}>
                {lead.user.username}
              </div>
              <div style={{ ...styles.subItem, color: 'rgb(66, 247, 28)', fontWeight: 'bold' }}>
                ${lead.amount}
              </div>
            </div>)
          })
          }
        </Scrollbars>
      </div>
    );
  }
}
const styles = {
  root: {
    flexGrow: 1,
    padding: 7
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    background: 'rgba(0,0,0,.2)',
    // borderRadius: 5,
    padding: '10px 5px',
    // marginTop: 10
    borderBottom: '1px solid #333'
  },
  subItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },

}
export default LeadBoard;