import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { t } from '../../locales';
import Context from '../../library/Context';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

const MyRadio = withStyles({
    root: {
        color: '#595959',
        '&$checked': {
            color: '#fff',
        },
    },
    checked: {},
})(props => <Radio color="default" {...props} />);

function tabGenerator(props) {
    return (
        <div style={styles.list}>
            {props.icon}
            <div style={styles.listText}>
                <Typography variant="subtitle1" display="block" style={{ marginLeft: 5 }} >
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
            <Box p={3}>{children}</Box>
        </Typography>
    );
}

const CssTextField = withStyles({
    root: {
        root: {
            color: '#fff'
        },
        '& label': {
            color: '#595959',
        },
        '& input': {
            color: '#fff',
        },
        '& label.Mui-focused': {
            color: '#fff',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#595959',
            },
            '&:hover fieldset': {
                borderColor: '#595959',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#595959',
            },
        },
    },
})(TextField);
class Deposit extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            tab: 0,
            amount: '100'
        };
        autoBind(this);
    }
    handleChange(e, tab) {
        this.setState({ tab });
    }
    changeAmount(e) {
        this.setState({ amount: e.target.value });
    }
    renderAmount() {
        return (
            <RadioGroup name="amount" value={this.state.amount} onChange={this.changeAmount}>
                <Grid container spacing={1}>
                    <Grid container item xs={12} spacing={2}>
                        <Grid item xs={6}>
                            <FormControlLabel style={styles.label} value="10000" control={<MyRadio />} label="$10,000" />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControlLabel style={styles.label} value="5000" control={<MyRadio />} label="$5,000" />
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} spacing={2}>
                        <Grid item xs={6}>
                            <FormControlLabel style={styles.label} value="2000" control={<MyRadio />} label="$2,000" />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControlLabel style={styles.label} value="1000" control={<MyRadio />} label="$1,000" />
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} spacing={2}>
                        <Grid item xs={6}>
                            <FormControlLabel style={styles.label} value="500" control={<MyRadio />} label="$500" />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControlLabel style={styles.label} value="250" control={<MyRadio />} label="$250" />
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} spacing={2}>
                        <Grid item xs={6}>
                            <FormControlLabel style={styles.label} value="100" control={<MyRadio />} label="$100" />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControlLabel style={styles.label} value="50" control={<MyRadio />} label="$50" />
                        </Grid>
                    </Grid>

                    <Grid container xs={12} spacing={2} style={{ marginTop: 30, borderTop: '1px solid #333' }}>
                        <Grid item xs={6}>
                            <CssTextField
                                onChange={this.changeUsername}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                label={t('amount')}
                                name="amount"
                                autoComplete="amount"
                                value={this.state.amount}
                            />
                        </Grid>
                        <Grid item xs={6} style={styles.procced}>
                            <Button
                                // onClick={this.submit}
                                type="button"
                                fullWidth
                                variant="contained"
                                color="primary"
                                style={styles.submit}
                            >
                                {this.state.loading ? <CircularProgress size={25} color="#fff" thickness={3} /> : t('proccedToPayment')}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </RadioGroup>
        )
    }
    render() {
        return (
            <div style={styles.root}>
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={this.state.tab}
                    onChange={this.handleChange}
                    aria-label="Vertical tabs example"
                    style={styles.tabs}
                >
                    <Tab label={tabGenerator({ title: t('bitcoin'), icon: <i class="cc BTC" /> })} />
                </Tabs>
                <TabPanel value={this.state.tab} index={0}>
                    {this.renderAmount()}
                </TabPanel>
            </div>
        );
    }
}
const styles = {
    root: {
        flexGrow: 1,
        display: 'flex',
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
    procced: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 23,
        paddingBottom: 15
    }
}
export default Deposit;