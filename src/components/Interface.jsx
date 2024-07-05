import { useState } from 'react';

function Interface(props) {
    const [buttonsClicked, setButtonsClicked] = useState({
        cuisine: false,
        salon: false,
        sdb: false,
        jardin: false,
    });

    const handleButtonClick = () => {
        props.toggleWaterMoving();
        props.toggleWaterMovingUp();
    };

    const handleButtonStateChange = (button) => {
        setButtonsClicked((prevState) => ({
            ...prevState,
            [button]: true,
        }));
    };

    const allButtonsClicked =
        buttonsClicked.cuisine &&
        buttonsClicked.salon &&
        buttonsClicked.sdb &&
        buttonsClicked.jardin;

    console.log(props.isReset);

    return (
        <div className='scenario_list'>
            <div
                className='scenario_correction'
                style={{
                    opacity: `${
                        props.isScenarioChanged && !props.isWaterMoving && !props.isWaterMovingUp
                            ? '100%'
                            : '0'
                    }`,
                }}
            >
                <button
                    className='button_white'
                    onClick={() => {
                        props.handleCameraPosition('cuisine');
                        handleButtonStateChange('cuisine');
                    }}
                    disabled={buttonsClicked.cuisine}
                >
                    Cuisine
                </button>
                <button
                    className='button_white'
                    onClick={() => {
                        props.handleCameraPosition('salon');
                        handleButtonStateChange('salon');
                    }}
                    disabled={buttonsClicked.salon}
                >
                    Salon
                </button>
                <button
                    className='button_white'
                    onClick={() => {
                        props.handleCameraPosition('sdb');
                        handleButtonStateChange('sdb');
                    }}
                    disabled={buttonsClicked.sdb}
                >
                    Salle de Bains
                </button>
                <button
                    className='button_white'
                    onClick={() => {
                        props.handleCameraPosition('jardin');
                        handleButtonStateChange('jardin');
                    }}
                    disabled={buttonsClicked.jardin}
                >
                    Jardin
                </button>
            </div>
            <div
                className='scenario_title'
                style={{ color: `${props.isReset ? '#ffffff' : '#000000'}` }}
            >
                Scénario A
            </div>

            <div className='scenario_animation'>
                <button
                    className='button_black'
                    onClick={() => {
                        handleButtonClick();
                    }}
                    disabled={props.isWaterMoving || props.isReset}
                >
                    {props.isWaterMoving
                        ? 'En mouvement ...'
                        : props.isWaterMovingUp
                        ? 'Descente'
                        : 'Montée'}
                    {` ${props.isWaterMoving ? `` : 'Eau'} `}
                </button>

                <button
                    className='button_black'
                    onClick={() => {
                        props.handleReset();
                    }}
                    disabled={!allButtonsClicked}
                >
                    Reset
                </button>
            </div>
        </div>
    );
}

export default Interface;
