import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

function Trigger(props) {


    const renderTooltip = (props) => {
        let message = "";
        let title = "";

        if (props.popper.state) {
            title = props.popper.state.options.title
            message = props.popper.state.options.body
        }


        return (
            <Tooltip id="tooltip" {...props}>
                {title}
                <br></br>
                {message}
            </Tooltip>
        )
    }

    return (
        <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}
            popperConfig={{ body: props.texts, title: props.title }}
        >
            {props.children}
        </OverlayTrigger>
    );
}

export default Trigger;