import React, {Component} from 'react';
import { Alert } from 'react-bootstrap';

class Films extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {films: props.films};
    }

    render() {
        let hidden = "hidden";
        if(this.props.films.length > 0) {
            hidden = "";
        }
        return (

            <div className="films">
                <p hidden={hidden}>合作電影</p>
                {this.props.films.map((film) => {
                    return <Alert variant='primary'>
                    {film.name} {film.year}
                    </Alert>
                })}
            </div>
            
        )
    }
}

export default Films;