import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { Scrollbars } from 'react-custom-scrollbars';
import { t } from 'locales';
import Context from 'library/Context';
import request from 'library/Fetch';
import { connect } from 'react-redux';
import { TabbarAdd } from 'redux/action/tab';
import { Market } from 'redux/action/market';
import { withStyles, createMuiTheme, fade } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ApartmentIcon from '@material-ui/icons/Apartment';
import InputBase from '@material-ui/core/InputBase';
import CircularProgress from '@material-ui/core/CircularProgress';
import MonetizationOnRoundedIcon from '@material-ui/icons/MonetizationOnRounded';
import SearchIcon from '@material-ui/icons/Search';
import VirtualizedTable from 'component/VirtualizedTable';

const AntTab = withStyles(theme => ({
    wrapper: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    selected: {},
}))(props => <Tab disableRipple {...props} />);

const ColorCircularProgress = withStyles({
    root: {
        color: '#fff',
    },
})(CircularProgress);

function tabGenerator(props) {
    return (
        <div style={styles.list}>
            {props.icon}
            <div style={styles.listText}>
                <Typography variant="subtitle1" display="block" style={{ marginLeft: 5, fontSize: '.85rem' }} >
                    {props.title}
                </Typography>
            </div>
        </div>
    )
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {children}
        </Typography>
    );
}


class AppModal extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
            tab: 0,
            searchValue: '',
            load: false
        };
        autoBind(this);
    }
    handleChange(e, tab) {
        this.setState({ tab, load: false, searchValue: '' });
        // setTimeout(() => {
        this.setState({ load: true });
        // }, 500);
    }

    handleSearch(e) {
        this.setState({ searchValue: e.target.value });
    }
    componentDidMount() {
        let check = ['crypto', 'forex', 'stock'];
        let i;
        // setTimeout(() => {
        this.setState({ load: true });
        // }, 400);
        for (i of check) {
            if (this.props.market[i] == null) {
                request('market/list/' + i, res => {
                    if (typeof res == 'object')
                        this.props.dispatch(Market(res));
                });
            }
        }
    }
    addTab(id, symbol, name, type) {
        this.props.dispatch(TabbarAdd({
            key: 't' + id,
            value: {
                id,
                symbol,
                name,
                type,
                resolution: this.context.state.setting.reolution,
                chartType: this.context.state.setting.chartType
            }
        }));
        let modal = this.context.app('modal');
        modal.hide();
    }
    loading(type) {
        if (this.props.market[type] == null || !this.state.load)
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '50vh' }} >
                    <ColorCircularProgress size={30} thickness={5} />
                </div>
            )
        return (
            <>
                {this.searchBar()}
                {this.generateTable(type)}
            </>
        )
    }
    generateTable(type) {
        let row;
        const rows = [];
        for (row of this.props.market[type]) {
            let regex = new RegExp(this.state.searchValue, 'gi');
            if (row.display.match(regex))
                rows.push(row);
        }
        return (
            <div style={styles.tableRoot} >
                <VirtualizedTable
                    rowCount={rows.length}
                    rowGetter={({ index }) => rows[index]}
                    columns={[
                        {
                            width: 300,
                            label: t('asset'),
                            dataKey: 'display',
                        },
                        {
                            width: 400,
                            label: t('description'),
                            dataKey: 'description',
                        },
                    ]}
                    onRowClick={({ rowData }) => this.addTab(rowData.id, rowData.symbol, rowData.display, type)}
                />
            </div>
        )
    }
    searchBar() {
        return (
            <div style={styles.search}>
                <div style={styles.searchIcon}>
                    <SearchIcon />
                </div>
                <InputBase
                    placeholder="Search…"
                    onChange={this.handleSearch}
                    style={styles.inputInput}
                />
            </div>
        )
    }
    render() {
        return (
            <div style={this.context.state.isPortrait ? styles.root2 : styles.root}>
                <Tabs
                    orientation={this.context.state.isPortrait ? "horizontal" : "vertical"}
                    variant="scrollable"
                    value={this.state.tab}
                    onChange={this.handleChange}
                    style={styles.tabs}
                >
                    <AntTab label={tabGenerator({ title: t('crypto'), icon: <i class="cc BTC" /> })} />
                    <AntTab label={tabGenerator({ title: t('forex'), icon: <MonetizationOnRoundedIcon style={styles.forex} /> })} />
                    <AntTab label={tabGenerator({ title: t('stocks'), icon: <ApartmentIcon style={styles.stocks} /> })} />
                </Tabs>
                <TabPanel value={this.state.tab} index={0} style={styles.tableRoot}>
                    {this.loading('crypto')}
                </TabPanel>
                <TabPanel value={this.state.tab} index={1} style={styles.tableRoot}>
                    {this.loading('forex')}
                </TabPanel>
                <TabPanel value={this.state.tab} index={2} style={styles.tableRoot}>
                    {this.loading('stock')}
                </TabPanel>
            </div>
        );
    }
}

let theme = createMuiTheme()
const styles = {
    root: {
        flexGrow: 1,
        display: 'flex',
        height: '70vh',
        overflow: 'hidden'
    },
    root2: {
        flexGrow: 1,
        display: 'flex',
        height: '77vh',
        flexDirection: 'column'
    },
    tableRoot: {
        width: '100%',
        height: '55vh',
        marginTop: '3vh',
        padding: 5
    },
    tableWrapper: {
        position: 'relative'
    },
    tabs: {
        borderRight: `1px solid #333`,
        overflow: 'visible'
    },
    list: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    label: {
        border: '1px solid #595959',
        borderRadius: 5,
        width: '100%'
    },
    stocks: {
        fontSize: 17,
        background: '#369',
        borderRadius: '50%',
        padding: 3,
        color: '#25272b '
    },
    forex: {
        fontSize: 27,
        color: 'rgb(230, 47, 27)',
        marginLeft: -4
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
        marginBottom: 10,
        marginTop: -20,
    },
    searchIcon: {
        width: theme.spacing(7),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: 120,
            '&:focus': {
                width: 200,
            },
        },
        color: '#fff',
    },
}

export default connect(state => state)(AppModal);