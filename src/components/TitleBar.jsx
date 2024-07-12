import React from 'react';
import { IoClose } from 'react-icons/io5';

function TitleBar({ scenario, sceneName }) {
    return (
        <div className='title_bar'>
            <div className='title_bar_scenario'>{scenario}</div>
            <div className='title_bar_sceneName'>{sceneName}</div>
            <button className='title_bar_closeIcon'>
                <IoClose />
            </button>
        </div>
    );
}

export default TitleBar;
