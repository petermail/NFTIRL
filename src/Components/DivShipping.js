import { useRef, useState } from "react";

export const DivShipping = (props) => {
    const { options, handleShippingChange } = props;
    const [isRestOfWorld, setIsRestOfWorld] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const change = (x, property) => { 
        handleShippingChange((old, x) => old[property] = x, x); 
    }
    const changeRegion = (x) => {
        change(x, "region");
        if (x && x.toUpperCase() === "REST OF THE WORLD") {
            setIsRestOfWorld(y => true);
        } else {
            setIsRestOfWorld(y => false);
        }
    }
    const euCountries = ["Austria", "Belgium", "Bulgaria", "Croatia", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden"];

    return (<div className="shipping margin20">
        <div onClick={() => setIsExpanded(x => x = !x)} className="middle">
            <img className={"rotatable" + (isExpanded ? "" : " rotate")} src={process.env.PUBLIC_URL + "/icon_bottom.png"} alt="expand/collapse" width={20} />
            &nbsp; Shipping details
        </div>
        { isExpanded &&
        <>
            <DivInput className="column" label="first name" size={18} onChange={x => change(x, "fileName")} />
            <DivInput className="column" label="last name" size={18} onChange={x => change(x, "lastName")} />
            <DivInput className="column" label="e-mail" size={48} onChange={x => change(x, "email")} />
            <DivInput className="column" label="phone" size={24} onChange={x => change(x, "phone")} />
            <DivCombobox className="column" options={options} label="region" onChange={x => changeRegion(x)} />
            { isRestOfWorld &&
                <DivDatalist className="column" options={euCountries} label="country" size={24} onChange={x => change(x, "country")} />
            }
            <div className="clear" />
            <DivInput className="column" label="address" size={50} onChange={x => change(x, "address1")} />
            <DivInput className="column" label="apartment" size={24} onChange={x => change(x, "address2")} />
            <div className="clear" />
            <DivInput className="column" label="postal code" size={18} onChange={x => change(x, "zip")} />
            <DivInput className="column" label="city" size={24} onChange={x => change(x, "city")} />
            <div className="clear" />
        </>
        }
    </div>)
}

const DivCombobox = (props) => {
    const { className, options, label, onChange } = props;
    const [value, setValue] = useState('');

    const handleChange = (e) => {
        setValue(x => e.target.value);
        if (e.target.value) {
            onChange(e.target.value);
        }
    }

    return (<div className={className}>
        <div>{label}</div>
        <select value={value} onChange={handleChange}>
            { options.map(x => <option key={x} value={x}>{x}</option>) }
        </select>
    </div>)
}

const DivDatalist = (props) => {
    const { className, options, label, onChange } = props;
    const [value, setValue] = useState('');

    const handleChange = (e) => {
        setValue(x => e.target.value);
        if (e.target.value) {
            onChange(e.target.value);
        }
    }

    return (<div className={className}>
        <div>{label}</div>
        <input type="text" list={label} value={value} onChange={handleChange} />
        <datalist id={label}>
            { options.map(x => <option key={x} value={x}>{x}</option>) }
        </datalist>
    </div>)
}

const DivInput = (props) => {
    const { className, size, label, onChange } = props;
    const [value, setValue] = useState('');

    const handleChange = (e) => {
        setValue(x => e.target.value);
        if (e.target.value) {
            onChange(e.target.value);
        }
    }

    return (<div className={className}>
        <div>{label}</div>
        <input type="input" size={size} value={value} onChange={handleChange} />
    </div>)
}