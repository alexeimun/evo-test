import React from 'react';
import { propType } from 'graphql-anywhere';
import styled from 'styled-components';
import { FormProps } from '../../render-props';
import { withUser } from '../../global-data-provider';
import userFragment from '../../graphql/user/fragment/user';

import LogoutBtn from '../../components/auth/logout-btn';
import Title from '../../components/common/title';
import Feedback from '../../components/common/feedback';
import Alert from '../../components/common/alert';
import Loading from '../../components/common/loading';
import Toast from "../../components/toast";

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/MoreVert';
import CreateTaskModal from "../../components/create-task-modal";
import { useQuery } from '@apollo/react-hooks';
import tasksQuery from "../../graphql/task/query/task";
import TextField from "@material-ui/core/TextField";

const moment = require('moment');

const useStyles = makeStyles(theme => ({
    text: {
        padding: theme.spacing(2, 2, 0),
    },
    paper: {
        paddingBottom: 50,
    },
    list: {
        marginBottom: theme.spacing(2),
    },
    subheader: {
        backgroundColor: theme.palette.background.paper,
    },
    appBar: {
        top: 0,
    },
    grow: {
        flexGrow: 1,
    }
}));

const HomePage = ({ curUser }) => {

    const classes = useStyles();
    const {error, data, loading, refetch} = useQuery(tasksQuery);
    const [criteria, setCriteria] = React.useState('');
    const [toastMsg, setToastMsg] = React.useState('');
    const [popupOpen, setPopupOpen] = React.useState(false);

    const handleChange = ({ target }) => {
        const { value } = target;
        setCriteria(value)
    };

    const handlePopup = () => {
        setPopupOpen(!popupOpen);
    };

    const mapTasks = (tasks) => {
        tasks.data = tasks.map(task => {
            task.expDate = moment(+task.expiresAt).format('DD/MM/YYYY');
            return task;
        }).sort((a, b) => a.priority - b.priority).reverse();
        tasks.msg = msg;

        return tasks;
    };

    if (error) return `Error! ${error.message}`;
    if (loading) return 'Loading...';
    const tasks = mapTasks(data.tasks).filter(task => filterCriteria(task, criteria));
    let threshold, notifiedOneTask = false, msg = '';
    tasks.map(task => {
        if (!notifiedOneTask) {
            threshold = moment(+task.expiresAt).diff(moment(), 'days');
            if (threshold === 0) msg = `La tarea "${task.title}" vence hoy`;
            else if (threshold === 1) msg = `La tarea "${task.title}" vence mañana`;
            notifiedOneTask = [0, 1].indexOf(threshold) !== -1;
        }
    });
    return (
        <React.Fragment>
            <AppBar position="fixed" color="primary" className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="open drawer">
                        <MenuIcon/>
                    </IconButton>
                    <div className={classes.grow}/>
                    <IconButton color="inherit" style={{position: 'absolute', left: '49%'}}>
                        <SearchIcon/>
                    </IconButton>
                    <IconButton edge="end" color="inherit" title={curUser.name} onClick={handlePopup}>
                        <Avatar alt={curUser.name}/>
                    </IconButton>
                    {popupOpen && <div className="popup-user">
                        <p>{curUser.name}</p>
                        <LogoutBtn />
                    </div>}

                    <div className="search-task">
                        <TextField
                            type="text"
                            placeholder="Buscar tareas"
                            onChange={handleChange}
                            margin="normal"
                            fullWidth
                        />
                    </div>
                </Toolbar>
            </AppBar>
            <FormProps>
                {({
                      disabled,
                      handleBefore,
                      handleClientCancel,
                      handleClientError,
                      handleServerError,
                      handleSuccess,
                  }) => (<CreateTaskModal disabled={disabled}
                                          onBeforeHook={handleBefore}
                                          onClientCancelHook={handleClientCancel}
                                          onClientErrorHook={handleClientError}
                                          onSuccessHook={() => {}}
                                          onError={handleServerError}
                                          onSuccess={handleSuccess}
                                          refetch={refetch}

                />)
                }
            </FormProps>
            <CssBaseline/>
            {msg && (<Toast severity="warning">{msg}</Toast>)}
            <Paper square className={classes.paper} style={{ marginTop: '20px'}}>
                <Typography className={classes.text} variant="h5" gutterBottom>
                    Tareas
                </Typography>
                <List className={classes.list}>{
                        tasks.map(({title, priority, expDate}, i) => (
                        <React.Fragment key={i}>
                            <ListItem button>
                                <div className="task-item">
                                    {priority === 1 && (<span className="priority priority-low" title="Prioridad baja">&#9679;</span>)}
                                    {priority === 2 && (<span className="priority" title="Prioridad media">&#9679;</span>)}
                                    {priority === 3 && (<span className="priority priority-high" title="Prioridad alta">&#9679;</span>)}
                                    <ListItemText primary={title} secondary={'Expira el ' + expDate}/>
                                </div>
                            </ListItem>
                        </React.Fragment>
                    ))}
                    {!tasks.length &&(<h3 className="none-result">No hay tareas por mostrar!</h3>)}
                </List>
            </Paper>

        </React.Fragment>
    );
};


HomePage.propTypes = {
  curUser: propType(userFragment).isRequired,
};

const filterCriteria = (task, criteria) => {
    if (!criteria) return true;
    else return JSON.stringify(task).toLowerCase().includes(criteria.toLowerCase());
};


export default withUser(HomePage);
