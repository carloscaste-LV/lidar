import React, { useState } from 'react';
export default function SectionMain() {
    
    const [menuContentVisible, setMenuContentVisible] = useState(true);

    function handleMenuButtonClick() {
        setMenuContentVisible(!menuContentVisible);
    }

    return (
            <section className="item item2" >#2</section>
    );
}






