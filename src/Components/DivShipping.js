import { useMemo, useRef, useState } from "react";

const { getData } = require('country-list');

export const DivShipping = (props) => {
    const { options, handleShippingChange, value, isShippingDone, countryList } = props;
    const [isRestOfWorld, setIsRestOfWorld] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const countries = useMemo(() => {
        return getData().map(x => x.name).sort();
    }, []);

    const change = (x, property) => {
        handleShippingChange((old, x) => old[property] = x, x); 
    }
    const changeRegion = (x) => {
        change(x, "region");
        if (x && x.toUpperCase() === "REST OF THE WORLD") {
            setIsRestOfWorld(y => true);
        } else {
            change("", "country");
            setIsRestOfWorld(y => false);
        }
    }

    return (<div className="shipping margin20">
        <div onClick={() => setIsExpanded(x => x = !x)} className="middle">
            <img className={"rotatable" + (isExpanded ? "" : " rotate")} src={process.env.PUBLIC_URL + "/icon_bottom.png"} alt="expand/collapse" width={20} />
            &nbsp; Shipping details

            {isShippingDone && (
                <>&nbsp; <img width={20} src={process.env.PUBLIC_URL + "/check.png"} alt="shipping done" /></>
            )}
        </div>
        { isExpanded &&
        <>
            <DivInput className="column" label="first name" size={18} onChange={x => change(x, "firstName")} initValue={value.firstName} />
            <DivInput className="column" label="last name" size={18} onChange={x => change(x, "lastName")} initValue={value.lastName} />
            <DivInput className="column" label="e-mail" size={48} onChange={x => change(x, "email")} initValue={value.email} />
            <DivInput className="column" label="phone" size={24} onChange={x => change(x, "phone")} initValue={value.phone} />
            {/*<DivCombobox className="column" options={options} label="region" onChange={x => changeRegion(x)} initValue={value.region} />*/}
            <DivCombobox className="column" options={countries} label="country" size={24} onChange={x => change(x, "country")} initValue={value.country} />
            
            <div className="clear" />
            <DivInput className="column" label="address" size={50} onChange={x => change(x, "address1")} initValue={value.address1} />
            <DivInput className="column" label="apartment" size={24} onChange={x => change(x, "address2")} initValue={value.address2} />
            <div className="clear" />
            <DivInput className="column" label="postal code" size={18} onChange={x => change(x, "zip")} initValue={value.zip} />
            <DivInput className="column" label="city" size={24} onChange={x => change(x, "city")} initValue={value.city} />
            <div className="clear" />
        </>
        }
    </div>)
}

const DivCombobox = (props) => {
    const { className, options, label, onChange, initValue } = props;
    const [value, setValue] = useState(initValue);

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
    const { className, options, label, onChange, initValue } = props;
    const [value, setValue] = useState(initValue);

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
    const { className, size, label, onChange, initValue } = props;
    const [value, setValue] = useState(initValue);

    const handleChange = (e) => {
        setValue(x => e.target.value);
        onChange(e.target.value);
    }

    return (<div className={className}>
        <div>{label}</div>
        <input type="input" size={size} value={value} onChange={handleChange} />
    </div>)
}