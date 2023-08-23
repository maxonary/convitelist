import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TitleImage.css';

interface TitleImageProps {
    src: string;
    alt: string;
}

const TitleImage: React.FC<TitleImageProps> = ({src, alt}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
    }

    return (
            <img
                src={src}
                alt={alt}
                className="title-image"
                onClick={handleClick}
            />
    );
}

export default TitleImage;
