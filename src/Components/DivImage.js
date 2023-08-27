import { useState } from "react";

const DivImage = (props)  => {
    //const [src, setSrc] = useState('');
    const { src, setSrc, friendsWallet, setFriendsWallet, handleCreateProduct } = props;
    const [isSrcAllowed, setIsSrcAllowed] = useState(false);
    const [isFriends, setIsFriends] = useState(false);

    const handleChange = (e) => {
        setSrc(x => e.target.value);
    }
    const handleWalletChange = (e) => {
        setFriendsWallet(x => e.target.value);
    }

    const componentUrl = () => {
        if (setSrc){
            if (!isSrcAllowed) {
                return (<div className="allowSrc" onClick={() => setIsSrcAllowed(x => true)}>
                    use image url
                </div>)
            } else {
                const srcReplaced = src.replace("https://github.com/petermail/NFTIRL/raw/master/public/", "");
                return (<div className="divImage">Image url:&nbsp;
                <input type="text" size={60} value={srcReplaced} onChange={handleChange} />
                {/*<div onClick={() => handleCreateProduct(src)}>upload image and create product</div>*/}
            </div>)
            }
        }
    }
    const componentWallet = () => {
        if (setFriendsWallet) {
            if (!isFriends) {
                return (<div className="allowSrc" onClick={() => setIsFriends(x => true)}>
                    use friend's wallet
                </div>);
            } else {
                return (<div className="divImage">Friend's wallet:&nbsp;
                    <input type="text" size={60} value={friendsWallet} onChange={handleWalletChange} />
                </div>)
            }
        }
    }

    /*if (!isSrcAllowed) {
        return (<div>{componentUrl()}<div className="allowSrc" onClick={() => setIsFriends(x => true)}>
                use friend's wallet
            </div>
        </div>)
    }
    else {
        return (<div className="divImage">Image url:&nbsp;
            <input type="text" size={60} value={src} onChange={handleChange} />
            {/*<div onClick={() => handleCreateProduct(src)}>upload image and create product</div>* /}
        </div>)
    }*/
    return (<div>{componentUrl()}{componentWallet()}</div>);
}

export default DivImage;