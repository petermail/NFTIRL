
const ChooseImage = (props) => {
    const images = ['https://tse4.mm.bing.net/th?id=OIP.yCfii-S-bS1UXp_XVoqAyAHaFV',
        'https://tse2.mm.bing.net/th?id=OIP.oVeiT4LzCXtk9JVBfN-gMQHaE7',
        'https://www.tech-recipes.com/wp-content/uploads/2018/07/featured-6.jpg'];
    const { imgSrc, setImgSrc } = props;

    const getClass = (src) => {
        return imgSrc === src ? 'selectedImage' : 'choiceImage';
    }

    return (<div className="images margin20">
        {images.map(x => <img className={getClass(x)} key={x} src={x} alt='' height={100} onClick={() => setImgSrc(x)} />)}
        {!images.includes(imgSrc) && 
            <img className={getClass(imgSrc)} key={imgSrc} src={imgSrc} alt='' height={100} onClick={() => setImgSrc(imgSrc)} />
        }
    </div>)
}

export default ChooseImage;