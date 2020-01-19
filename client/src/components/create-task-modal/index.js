import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import ErrorHandling from "error-handling-utils";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {graphql} from "react-apollo";
import createTaskMutation from "../../graphql/task/mutation/task";
import {KeyboardDatePicker,MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const useStyles = makeStyles(theme => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        borderRadius: '4px',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        top: '20%',
        left: '35%'
    },
    fabButton: {
        position: 'fixed',
        zIndex: 9999,
        bottom: 20,
        right: 108,
    }
}));

function GeneralModal({children, open, onHandleClose, onHandleOpen}) {
    const classes = useStyles();

    return (
        <div>
            <Fab color="secondary" aria-label="add" onClick={onHandleOpen} className={classes.fabButton}>
                             <AddIcon/>
                </Fab>
            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                open={open}
                onClose={onHandleClose}
            >
                <div className={classes.paper}>
                    <h2 id="modal-title" style={{color: '#7f7f7f'}}>Crear tarea</h2>
                    {children}
                </div>
            </Modal>
        </div>
    );
}

class CreateTaskModal extends React.Component {
    state = {
        classes: {},
        title: '',
        priority: 2,
        expiresAt: new Date,
        open: false,
        errors: {title: [], priority: []},
    };

    onHandleClose = () => {
        this.setState({open: false});
    };

    onHandleOpen = () => {
        this.setState({open: true});
    };

    handleChange = ({target}) => {
        const {id: field, value} = target;
        const {errors} = this.state;

        this.setState({
            [field]: value,
            errors: ErrorHandling.clearErrors(errors, field),
        });
    };

    handlePriorityChange = ({target: {value}}) => {
        this.setState({priority: value});
    };

    validateFields = ({title}) => {
        const errors = {
            title: [],
        };

        // Sanitize input
        const _title = title && title.trim(); // eslint-disable-line no-underscore-dangle

        if (!_title) {
            errors.title.push('El título es requerido!');
        }

        return errors;
    };

    clearErrors = () => {
        this.setState({errors: {title: []}});
    };

    handleSubmit = (evt) => {
        evt.preventDefault();

        const {
            onBeforeHook,
            onClientCancelHook,
            onClientErrorHook,
        } = this.props;

        // Run before logic if provided and return on error
        try {
            onBeforeHook();
        } catch (exc) {
            onClientCancelHook();
            return; // return silently
        }

        // Get field values
        const {title} = this.state;
        // Clear previous errors if any
        this.clearErrors();

        // Validate fields
        const errors = this.validateFields({title});

        // In case of errors, display on UI and return handler to parent component
        if (ErrorHandling.hasErrors(errors)) {
            this.setState({errors});
            onClientErrorHook(errors);
            return;
        }
        this.handleSuccess();

        // Pass event up to parent component
        // onSuccessHook({email, password});
    };

    handleSuccess = async () => {
        const {onSuccess, onError, createTask, refetch} = this.props;
        const {title, priority, expiresAt} = this.state;

        try {
            const res = await createTask({variables: {task: {title, priority, expiresAt}}});
            onSuccess(res.data);
            this.setState({
                title: '',
                priority: 2,
                expiresAt: new Date
            });

            this.onHandleClose();
            refetch()
        } catch (exc) {
            console.log(exc);
            onError(exc);
        }
    };

    handleDateChange = expiresAt => {
        this.setState({expiresAt});
    };

    render() {
        const {disabled} = this.props;
        const {title, priority, errors, expiresAt, open} = this.state;

        const titleErrors = ErrorHandling.getFieldErrors(errors, 'title');

        return (
            <>
            <GeneralModal open={open} onHandleOpen={this.onHandleOpen} onHandleClose={this.onHandleClose}>
            <form
                onSubmit={this.handleSubmit}
                noValidate
                autoComplete="off"
            >
                <TextField
                    id="title"
                    type="title"
                    label="Título"
                    value={title}
                    onChange={this.handleChange}
                    margin="normal"
                    fullWidth
                    error={titleErrors.length > 0}
                    helperText={titleErrors || ''}
                />
                <div className="mb2" />

                <FormControl style={{width: '336px'}}>
                    <InputLabel id="demo-simple-select-label">Prioridad</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={priority}
                        fullWidth
                        autoWidth={false}
                        onChange={this.handlePriorityChange}
                    >
                        <MenuItem value={1}>Baja</MenuItem>
                        <MenuItem value={2}>Media</MenuItem>
                        <MenuItem value={3}>Alta</MenuItem>
                    </Select>
                </FormControl>
                <div className="mb2"/>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    style={{width: '336px'}}
                    margin="normal"
                    label="Fecha de expiración"
                    format="dd/MM/yyyy"
                    value={expiresAt}
                    onChange={this.handleDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'Fecha de expiración',
                    }}
                />
                </MuiPickersUtilsProvider>

                <div className="mb4"/>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={disabled}
                >
                   Agregar
                </Button>
            </form>
           </GeneralModal>
       </>
        );
    }
}
GeneralModal.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.object,
    ]).isRequired,
    onHandleOpen: PropTypes.func,
    onHandleClose: PropTypes.func
};


CreateTaskModal.propTypes = {
    disabled: PropTypes.bool,
    onClientErrorHook: PropTypes.func,
    onSuccess: PropTypes.func,
    onError: PropTypes.func,
    onBeforeHook: PropTypes.func,
    onClientCancelHook: PropTypes.func,
    onSuccessHook: PropTypes.func,
    createTask: PropTypes.func,
    refetch: PropTypes.func
};

CreateTaskModal.defaultProps = {
    disabled: false,
    onClientErrorHook: () => {},
    onSuccess: () => {},
    onError: () => {},
};
const withMutation = graphql(createTaskMutation, { name: 'createTask' });
export default withMutation(CreateTaskModal);
