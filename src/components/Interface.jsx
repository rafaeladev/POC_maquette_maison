import React, { useEffect } from 'react';

function Interface(props) {
    // Gestionnaire pour le clic sur le bouton principal
    const handleMainButtonClick = () => {
        if (props.isWaterMovingUp) {
            props.toggleWaterMovingUp(false);
        } else if (!props.isScenarioChanged) {
            props.toggleWaterMovingUp(true);
        } else {
            props.toggleScenario(false);
        }
        props.toggleWaterMoving(true);
    };

    // Gestionnaire pour le clic sur le bouton Reset
    const handleResetClick = () => {
        props.resetScenario(); // Vous devez définir cette méthode dans vos props
        console.log('Reset button clicked');
    };

    return (
        <div className='pointList'>
            <button
                onClick={() => {
                    props.isWaterMovingUp
                        ? props.toggleWaterMovingUp(false)
                        : !props.isScenarioChanged
                        ? props.toggleWaterMovingUp(true)
                        : props.toggleScenario(false);

                    props.toggleWaterMoving(true);
                }}
                disabled={props.isWaterMoving}
                // style={{{}}}

                // style={{ cursor: props.isWaterMoving ? 'none' : 'pointer' }}
            >{`${
                props.isScenarioChanged && !props.isWaterMovingUp && !props.isWaterMoving
                    ? ``
                    : 'Water'
            } ${
                props.isWaterMoving
                    ? 'is mooving ...'
                    : props.isWaterMovingUp
                    ? 'Down'
                    : props.isScenarioChanged
                    ? 'Reset'
                    : 'Up'
            }`}</button>
        </div>
    );
}

export default Interface;
