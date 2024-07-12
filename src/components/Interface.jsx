import { useState } from 'react';
import { GrPowerReset } from 'react-icons/gr';
import TitleBar from './TitleBar';

import waterDown from '/icones/water_down.svg';
import waterUp from '/icones/water_up.svg';
import reset from '/icones/reset.svg';

import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';

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

    return (
        <div className='scenario_list'>
            <TitleBar
                scenario='A'
                sceneName='Maison globale'
            />
            {/* <div className='scenario_correction'>
                <button
                    className=''
                    onClick={() => {
                        props.handleCameraPosition('cuisine');
                        handleButtonStateChange('cuisine');
                    }}
                    disabled={buttonsClicked.cuisine}
                >
                    Cuisine
                </button>
                <button
                    className=''
                    onClick={() => {
                        props.handleCameraPosition('salon');
                        handleButtonStateChange('salon');
                    }}
                    disabled={buttonsClicked.salon}
                >
                    Salon
                </button>
                <button
                    className=''
                    onClick={() => {
                        props.handleCameraPosition('sdb');
                        handleButtonStateChange('sdb');
                    }}
                    disabled={buttonsClicked.sdb}
                >
                    Salle de Bains
                </button>
                <button
                    className=''
                    onClick={() => {
                        props.handleCameraPosition('jardin');
                        handleButtonStateChange('jardin');
                    }}
                    disabled={buttonsClicked.jardin}
                >
                    Jardin
                </button>
            </div> */}

            <div className='scenario_container'>
                <button
                    className='button_look_around'
                    onClick={() => {
                        props.handleReset();
                    }}
                >
                    <IoIosArrowBack />
                </button>
                <button
                    className='button_look_around'
                    onClick={() => {
                        props.handleReset();
                    }}
                >
                    <IoIosArrowForward />
                </button>
            </div>
            <div className='scenario_list_buttons'>
                <button
                    className='button_animation_menu'
                    onClick={() => {
                        handleButtonClick();
                    }}
                    disabled={props.isWaterMoving || props.isReset}
                >
                    {props.isWaterMoving
                        ? 'Animation en cours ...'
                        : props.isWaterMovingUp
                        ? `Lancer la décrue`
                        : `Lancer la crue`}
                    <img
                        src={waterUp}
                        alt='water icon'
                    />
                </button>

                <button
                    className='button_reset_menu'
                    onClick={() => {
                        props.handleReset();
                    }}
                    disabled={!allButtonsClicked}
                >
                    <img
                        src={reset}
                        alt='reset icon'
                    />
                </button>
            </div>
        </div>
    );
}

export default Interface;
